import { appendFile, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import type { LLMClient } from '../agent/types'
import { LLMContextLengthError, LLMHTTPError } from '../agent/types'
import type { GeneratorRole } from './types'
import { synthesizeAcceptedPlan } from './accepted-plan'
import { readApprovedCdmApiContract } from './approved-cdm-api-contract'
import { guardCritiqueReviewerDecision } from './critique-resolution-guard'
import { isAcceptedDecision, parsePlanningDecision } from './decision'
import { runGates } from './gates'
import {
  implementationArtifactGateResult,
  repairRequiresWrite,
  validateImplementationArtifacts,
  type RepairWriteRequirement,
} from './implementation-artifacts'
import { createJavaProjectShell } from './java-shell'
import type { GeneratorLogger } from './logger'
import { createConsoleGeneratorLogger } from './logger'
import { appendRunLog } from './run-log'
import { createRunEventWriter, gateFailureNames, roleTranscriptPath, type RunEventWriter } from './run-events'
import { renderAgentLoopSummary, writeRunTraceIndex, type RepairTraceRow } from './run-trace'
import {
  CRITIC_SYSTEM_PROMPT,
  CRITIQUE_REVIEWER_SYSTEM_PROMPT,
  IMPLEMENTER_SYSTEM_PROMPT,
  PLANNER_SYSTEM_PROMPT,
  REPAIR_SYSTEM_PROMPT,
  buildRoleMessages,
  type RoleContextTier,
} from './prompts'
import { renderGateFailureClassification } from './gate-classification'
import { describeGateAuthority, policyForGateName } from './gate-policy'
import { promoteGeneratedJar } from './promotion'
import { writeRepairFocusPacket } from './repair-focus'
import { writeFinalBuildReport, writeToolAuditLog } from './reports'
import {
  DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
  renderPlanValidation,
  validatePlannerPlan,
} from './plan-validator'
import { renderPlanValidationRepairGuidance } from './plan-validation-repair-guidance'
import { selectPlannerArtifactContent } from './planner-artifact'
import { buildPlannerRoundInstruction } from './planner-round-instruction'
import type { ProductScopeGuidance } from './product-scope'
import { requiredRosettaAreasForScope } from './rosetta-retrieval'
import { writeRoundSummary } from './round-summary'
import { writeGoodJavaGuaranteeReview } from './good-java-guarantee-review'
import {
  appendCostLedgerEntry,
  appendStageManifestEntry,
  createStageEntry,
  stageArtifactExists,
} from './stage-tracking'
import { callRoleWithTools, type LlmCallTrace } from './tool-runner'
import {
  createToolExecutionState,
  executeGeneratorTool,
  GENERATOR_LLM_TOOLS,
  IMPLEMENTER_RESEARCH_TOOLS,
  IMPLEMENTER_WRITE_TOOLS,
  REPAIR_RESEARCH_TOOLS,
  REPAIR_WRITE_TOOLS,
} from './tools'
import type { LLMTool } from '../agent/types'
import type { ToolCallPolicy } from './tool-runner'
import { createWorkspace } from './workspace'
import type {
  ActiveStageContext,
  GateResult,
  GeneratorLlmBudget,
  GeneratorRunConfig,
  GeneratorWorkspace,
  RolePhase,
  ToolAuditEntry,
  ToolExecutionState,
} from './types'

type LlmBudgetState = GeneratorLlmBudget & {
  usedCalls: number
}

export async function runJavaGeneratorAgent(args: {
  llm: LLMClient
  config: GeneratorRunConfig
}): Promise<void> {
  const logger = createConsoleGeneratorLogger()
  logger.info('run_start', {
    runId: args.config.runId,
    productFamily: args.config.productFamily,
  })
  logger.info('orchestration_mode', {
    mode: shouldRunGatesOnlySmokeFirst(args.config) ? 'gates_only_smoke' : 'full',
  })
  await mkdir(resolve(args.config.runOutputDir, 'build-reports'), { recursive: true })
  const events = createRunEventWriter(args.config)
  const repairTraceRows: RepairTraceRow[] = []
  const workspace = await createWorkspace(args.config)
  await createJavaProjectShell(args.config)
  const wsEvent = await events.emit({
    kind: 'workspace.created',
    status: 'passed',
    summary: 'Workspace and generated Java shell created.',
    artifactPaths: [workspace.runLogPath, args.config.runOutputDir],
  })
  await appendRunLog(workspace.runLogPath, {
    title: 'Workspace ready',
    sourceEventId: wsEvent.eventId,
    details: { runOutputDir: args.config.runOutputDir },
  })
  const audit: ToolAuditEntry[] = []
  const toolState = createToolExecutionState()
  const budgetState = createLlmBudgetState(args.config)
  await appendStageManifestEntry(
    args.config,
    createStageEntry({
      stage: 'preflight',
      status: args.config.cdmRosettaPreflight?.status === 'passed' ? 'passed' : 'failed',
      artifact: workspace.cdmRosettaPreflightPath,
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      toolCalls: 0,
      failedToolCalls: 0,
      message:
        args.config.cdmRosettaPreflight?.status === 'passed'
          ? 'Workspace and Rosetta-native Java shell created.'
          : 'CDM/Rosetta Java dependency preflight is blocked.',
    })
  )
  try {
    if (args.config.cdmRosettaPreflight?.status !== 'passed') {
      throw new Error('CDM/Rosetta Java dependency preflight is blocked; see agent-workspace/cdm-rosetta-preflight.md.')
    }
    if (shouldRunGatesOnlySmokeFirst(args.config)) {
      const gateResults = await runAndLogGates(args.config, workspace, logger, events, audit)
      if (!gateResults.some(result => result.status === 'failed' && describeGateAuthority(result) !== 'diagnostic')) {
        const promoted = await promoteGeneratedJar(args.config, gateResults)
        await writeFinalBlockedReports(
          args.config,
          workspace,
          audit,
          gateResults,
          logger,
          promoted,
          events,
          repairTraceRows
        )
        return
      }
      logger.warn('deterministic_fx_forward_poc_failed_agent_loop_continues', {
        failedGates: gateFailureNames(gateResults).join(','),
      })
    }
    let accepted = await runPlanningLoop(
      args.llm,
      args.config,
      workspace,
      audit,
      toolState,
      logger,
      budgetState,
      events,
      { contextTier: 'full' }
    )
    if (!accepted) {
      logger.warn('planning_nonconvergence_retry_compact', {})
      await appendRunLog(workspace.runLogPath, {
        title: 'Planning did not converge; clearing round artifacts and retrying with compact role context',
      })
      await clearPlanningRoundArtifacts(workspace.rootDir, logger)
      accepted = await runPlanningLoop(
        args.llm,
        args.config,
        workspace,
        audit,
        toolState,
        logger,
        budgetState,
        events,
        { contextTier: 'compact' }
      )
    }
    if (!accepted) {
      const message =
        'Planning did not converge after full-context and compact-context attempts. See agent-workspace/00-run-log.md and round-*/plan-validation.md.'
      logger.error('planning_nonconvergence_final', { message })
      try {
        await events.emit({
          kind: 'run.completed',
          status: 'failed',
          summary: 'Planning did not converge',
          details: { message },
        })
      } catch {
        /* workspace may be missing */
      }
      await appendRunLog(workspace.runLogPath, {
        title: 'Generator run ended after planning non-convergence',
        details: { message },
      })
      await writeFinalBuildReport({
        config: args.config,
        gateResults: [],
        promoted: false,
        markdown: `# Final Build Report

Status: blocked
Run id: ${args.config.runId}

Planning did not converge within the configured rounds (after a compact-context retry). No jar promotion.

## Details

\`\`\`text
${message}
\`\`\`
`,
      })
      await writeGoodJavaGuaranteeReview({
        config: args.config,
        workspace,
        gateResults: [],
        promoted: false,
        errorMessage: message,
      })
      await writeToolAuditLog(args.config, audit)
      process.exitCode = 1
      return
    }

    if (args.config.requireApproval) {
      await appendRunLog(workspace.runLogPath, {
        title: 'Approval required',
        details: { acceptedPlanPath: workspace.acceptedPlanPath },
      })
      await writeToolAuditLog(args.config, audit)
      logger.info('approval_required', { acceptedPlanPath: workspace.acceptedPlanPath })
      return
    }

    const implementationReport = await runImplementer(
      args.llm,
      args.config,
      workspace,
      audit,
      toolState,
      logger,
      budgetState,
      events
    )
    let nextRepairAttempt = 1
    if (implementationReport.status === 'failed') {
      const gateResults = [implementationArtifactGateResult(implementationReport)]
      if (
        budgetState.maxRepairAttempts < 1
        || !isRepairableImplementationArtifactFailure(implementationReport)
      ) {
        await writeFinalBlockedReports(
          args.config,
          workspace,
          audit,
          gateResults,
          logger,
          false,
          events,
          repairTraceRows
        )
        return
      }
      const repairReport = await runRepair(
        args.llm,
        args.config,
        workspace,
        audit,
        toolState,
        gateResults,
        1,
        logger,
        budgetState,
        events,
        repairTraceRows
      )
      nextRepairAttempt = 2
      if (repairReport.status === 'failed') {
        const repairedGateResults = [implementationArtifactGateResult(repairReport)]
        await writeFinalBlockedReports(
          args.config,
          workspace,
          audit,
          repairedGateResults,
          logger,
          false,
          events,
          repairTraceRows
        )
        return
      }
    }
    let gateResults = await runAndLogGates(args.config, workspace, logger, events, audit)

    for (
      let attempt = nextRepairAttempt;
      hasFailures(gateResults) && attempt <= Math.min(args.config.maxRepairAttempts, budgetState.maxRepairAttempts);
      attempt += 1
    ) {
      await runRepair(
        args.llm,
        args.config,
        workspace,
        audit,
        toolState,
        gateResults,
        attempt,
        logger,
        budgetState,
        events,
        repairTraceRows
      )
      gateResults = await runAndLogGates(args.config, workspace, logger, events, audit)
    }

    const promoted = await promoteGeneratedJar(args.config, gateResults)
    await writeFinalBlockedReports(
      args.config,
      workspace,
      audit,
      gateResults,
      logger,
      promoted,
      events,
      repairTraceRows
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    logger.error('run_failed', { error: message })
    try {
      await events.emit({
        kind: 'run.completed',
        status: 'failed',
        summary: 'Generator run failed',
        details: { error: message },
      })
    } catch {
      /* workspace may be missing */
    }
    await appendRunLog(workspace.runLogPath, {
      title: 'Generator run failed',
      details: { error: message },
    })
    await writeFinalBuildReport({
      config: args.config,
      gateResults: [],
      promoted: false,
      markdown: `# Final Build Report

Status: blocked
Run id: ${args.config.runId}

The generator run failed before jar promotion.

## Error

\`\`\`text
${message}
\`\`\`
`,
    })
    await writeGoodJavaGuaranteeReview({
      config: args.config,
      workspace,
      gateResults: [],
      promoted: false,
      errorMessage: message,
    })
    await writeToolAuditLog(args.config, audit)
    throw error
  }
}

type PlanningLoopOptions = {
  contextTier?: RoleContextTier
}

async function runPlanningLoop(
  llm: LLMClient,
  config: GeneratorRunConfig,
  workspace: GeneratorWorkspace,
  audit: ToolAuditEntry[],
  toolState: ToolExecutionState,
  logger: GeneratorLogger,
  budgetState: LlmBudgetState,
  events: RunEventWriter,
  options?: PlanningLoopOptions
): Promise<boolean> {
  const contextTier = options?.contextTier ?? 'full'
  const productScope = JSON.parse(await readFile(workspace.productScopeJsonPath, 'utf8')) as ProductScopeGuidance
  const approvedContract = await readApprovedCdmApiContract(workspace.approvedCdmApiContractPath)
  const approvedCdmClassNames = approvedContract.approvedClasses.map(item => item.className)

  for (let round = 1; round <= config.maxPlanningRounds; round += 1) {
    const roundDir = join(workspace.rootDir, `round-${String(round).padStart(2, '0')}`)
    await mkdir(roundDir, { recursive: true })
    const plannerPath = join(roundDir, 'planner-plan.md')
    const criticPath = join(roundDir, 'critic-review.md')
    const resolutionPath = join(roundDir, 'critique-resolution.md')
    const validationPath = join(roundDir, 'plan-validation.md')

    if (
      config.resume &&
      (await stageArtifactExists(plannerPath)) &&
      (await stageArtifactExists(criticPath)) &&
      (await stageArtifactExists(resolutionPath)) &&
      (await stageArtifactExists(validationPath))
    ) {
      const resolution = await readFile(resolutionPath, 'utf8')
      const validationMarkdown = await readFile(validationPath, 'utf8')
      if (
        isAcceptedDecision(resolution)
        && /Status:\s*passed/iu.test(validationMarkdown)
        && /Parsed generated package:/iu.test(validationMarkdown)
        && /Parsed Rosetta areas:/iu.test(validationMarkdown)
      ) {
        if (!(await stageArtifactExists(workspace.acceptedPlanPath))) {
          await synthesizeAcceptedPlan({
            round,
            productScopePath: workspace.productScopePath,
            evidencePacketPath: workspace.evidencePacketPath,
            plannerPath,
            criticPath,
            resolutionPath,
            validationPath,
            outputPath: workspace.acceptedPlanPath,
          })
        }
        return true
      }
      logger.info('planning_round_resume_skip', { round })
      continue
    }

    await appendRunLog(workspace.runLogPath, { title: `Planning round ${round} started` })
    logger.info('planning_round_start', { round })

    const plannerArtifactPath = `agent-workspace/round-${String(round).padStart(2, '0')}/planner-plan.md`
    const plannerExtraPaths =
      contextTier === 'compact'
        ? previousRoundFeedbackPathsCompact(workspace, round)
        : previousRoundFeedbackPaths(workspace, round)
    const plannerRun = await runRole({
      llm,
      config,
      workspace,
      audit,
      toolState,
      stage: stageContext('planner', round, { phase: 'planning' }),
      systemPrompt: PLANNER_SYSTEM_PROMPT,
      userInstruction: [
        buildPlannerRoundInstruction(round),
        `If you write the planner artifact with write_file, the only valid path is ${plannerArtifactPath}.`,
        contextTier === 'compact'
          ? 'Compact context mode: rely on tools (get_context_packet, get_rosetta_mapping_area, get_approved_cdm_api_contract) for evidence; the prompt omits evidence-index and full semantic-recipes.md.'
          : '',
      ]
        .filter(Boolean)
        .join('\n'),
      extraPaths: plannerExtraPaths,
      contextTier,
      roleName: 'planner',
      logger,
      budgetState,
      runEvents: events,
    })
    const planner = await selectPlannerArtifactContent({
      modelContent: plannerRun.content,
      artifactPath: plannerPath,
    })
    if (planner !== plannerRun.content) {
      logger.warn('planner_tool_written_artifact_preserved', { round })
    }
    await writeFile(plannerPath, planner, 'utf8')
    logger.info('role_artifact_written', { role: 'planner', round })

    const validation = validatePlannerPlan({
      planMarkdown: planner,
      scope: productScope,
      runtimeFixtureIds: config.runtimeFixtures.map(fixture => fixture.id),
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: config.productFamily,
        implementationGroup: productScope.currentImplementationGroup,
      }),
      approvedCdmClassNames,
    })
    await writeFile(validationPath, renderPlanValidation(validation), 'utf8')
    await writeFile(
      join(roundDir, 'plan-validation.json'),
      JSON.stringify(validation, null, 2),
      'utf8'
    )

    if (validation.status === 'failed') {
      const deterministicCritic = [
        '# Deterministic Plan Validation',
        '',
        'The planner output failed machine validation before LLM critique.',
        '',
        await readFile(validationPath, 'utf8'),
        '',
        '## Required Next-Round Repairs',
        '',
        renderPlanValidationRepairGuidance(validation),
        '',
        round === config.maxPlanningRounds ? 'Decision: FAILED' : 'Decision: NEXT_ROUND_REQUIRED',
      ].join('\n')
      await writeFile(criticPath, deterministicCritic, 'utf8')
      await writeFile(resolutionPath, deterministicCritic, 'utf8')
      await writeRoundSummary({ round, plannerPath, criticPath, resolutionPath, outputPath: join(roundDir, 'round-summary.md') })
      logger.warn('planning_round_validation_failed', { round })
      continue
    }

    const criticRun = await runRole({
      llm,
      config,
      workspace,
      audit,
      toolState,
      stage: stageContext('critic', round, { phase: 'planning' }),
      systemPrompt: CRITIC_SYSTEM_PROMPT,
      userInstruction:
        'Review the current planner-plan.md. Use plan-validation.md as deterministic pre-review context.',
      extraPaths: [plannerPath, validationPath],
      contextTier,
      roleName: 'critic',
      logger,
      budgetState,
      tools: [],
      maxToolRoundsOverride: 1,
      runEvents: events,
    })
    const critic = criticRun.content
    await writeFile(criticPath, critic, 'utf8')
    logger.info('role_artifact_written', { role: 'critic', round })

    const criticDecision = parsePlanningDecision(critic)
    if (criticDecision === 'accepted') {
      const resolution = [
        '# Critique Resolution',
        '',
        'Deterministic validation passed and the critic accepted the plan. Skipping secondary critique arbitration.',
        '',
        'Decision: ACCEPTED',
      ].join('\n')
      await writeFile(resolutionPath, resolution, 'utf8')
      await writeRoundSummary({ round, plannerPath, criticPath, resolutionPath, outputPath: join(roundDir, 'round-summary.md') })
      await synthesizeAcceptedPlan({
        round,
        productScopePath: workspace.productScopePath,
        evidencePacketPath: workspace.evidencePacketPath,
        plannerPath,
        criticPath,
        resolutionPath,
        validationPath,
        outputPath: workspace.acceptedPlanPath,
      })
      await appendRunLog(workspace.runLogPath, {
        title: `Planning accepted in round ${round}`,
        details: { plannerPath, criticPath, resolutionPath, validationPath },
      })
      logger.info('planning_accepted', { round })
      return true
    }

    const resolutionRun = await runRole({
      llm,
      config,
      workspace,
      audit,
      toolState,
      stage: stageContext('critique-reviewer', round, { phase: 'planning' }),
      systemPrompt: CRITIQUE_REVIEWER_SYSTEM_PROMPT,
      userInstruction: [
        'Resolve the critic review and decide whether this planning round is accepted.',
        `Planning round: ${round}/${config.maxPlanningRounds}.`,
        round === config.maxPlanningRounds
          ? 'This is the final planning round. Accept with conditions for non-blocking issues; fail only for true blockers.'
          : 'More planning rounds remain if blocking issues are fixable.',
      ].join('\n'),
      extraPaths: [plannerPath, criticPath, validationPath],
      contextTier,
      roleName: 'critique-reviewer',
      logger,
      budgetState,
      tools: [],
      maxToolRoundsOverride: 1,
      runEvents: events,
    })
    let resolution = resolutionRun.content
    let decision = parsePlanningDecision(resolution)
    if (decision === 'unrecognized') {
      const fallbackDecision = criticDecision === 'failed' || round === config.maxPlanningRounds
        ? 'FAILED'
        : 'NEXT_ROUND_REQUIRED'
      resolution = [
        resolution,
        '',
        '## Deterministic Decision Fallback',
        '',
        `Critique reviewer did not emit a parseable decision. Falling back to critic decision policy for round ${round}/${config.maxPlanningRounds}.`,
        '',
        `Decision: ${fallbackDecision}`,
      ].join('\n')
      decision = parsePlanningDecision(resolution)
    }
    const guarded = guardCritiqueReviewerDecision({
      decision,
      resolution,
      validationResult: validation,
      contract: approvedContract,
      finalRound: round === config.maxPlanningRounds,
    })
    decision = guarded.decision
    resolution = guarded.resolution
    await writeFile(resolutionPath, resolution, 'utf8')
    logger.info('role_artifact_written', { role: 'critique-reviewer', round })

    const summaryPath = join(roundDir, 'round-summary.md')
    await writeRoundSummary({ round, plannerPath, criticPath, resolutionPath, outputPath: summaryPath })

    if (decision === 'failed') {
      await appendRunLog(workspace.runLogPath, {
        title: `Planning failed terminally in round ${round}`,
        details: { resolutionPath },
      })
      throw new Error(`Planning failed terminally in round ${round}; see ${resolutionPath}.`)
    }

    if (decision === 'accepted') {
      await synthesizeAcceptedPlan({
        round,
        productScopePath: workspace.productScopePath,
        evidencePacketPath: workspace.evidencePacketPath,
        plannerPath,
        criticPath,
        resolutionPath,
        validationPath,
        outputPath: workspace.acceptedPlanPath,
      })
      await appendRunLog(workspace.runLogPath, {
        title: `Planning accepted in round ${round}`,
        details: { acceptedPlanPath: workspace.acceptedPlanPath },
      })
      logger.info('planning_accepted', { round })
      return true
    }
    logger.warn('planning_round_not_accepted', { round })
  }
  await appendRunLog(workspace.runLogPath, { title: 'Planning failed to converge' })
  return false
}

async function runImplementer(
  llm: LLMClient,
  config: GeneratorRunConfig,
  workspace: GeneratorWorkspace,
  audit: ToolAuditEntry[],
  toolState: ToolExecutionState,
  logger: GeneratorLogger,
  budgetState: LlmBudgetState,
  events: RunEventWriter
): Promise<Awaited<ReturnType<typeof validateImplementationArtifacts>>> {
  const evStart = await events.emit({
    kind: 'stage.started',
    role: 'implementer',
    phase: 'research',
    status: 'started',
    summary: 'Implementer research started',
  })
  await appendRunLog(workspace.runLogPath, {
    title: 'Implementer started',
    sourceEventId: evStart.eventId,
  })
  logger.info('implementer_start')
  const auditStart = audit.length
  const researchRun = await runRole({
    llm,
    config,
    workspace,
    audit,
    toolState,
    stage: stageContext('implementer', undefined, { phase: 'research' }),
    systemPrompt: IMPLEMENTER_SYSTEM_PROMPT,
    userInstruction:
      'Research the implementation now. Use read/context tools only. Produce a concise file manifest and implementation outline; do not include Java source and do not write pseudo tool calls.',
    roleName: 'implementer',
    logger,
    budgetState,
    recordStage: false,
    tools: IMPLEMENTER_RESEARCH_TOOLS,
    maxToolRoundsOverride: config.roleModels.implementer.maxToolRounds,
    toolCallPolicy: { pseudoToolCallsAreFatal: true },
    runEvents: events,
  })
  const auditAfterResearch = audit.length
  const researchTranscript = roleTranscriptPath({
    runOutputDir: config.runOutputDir,
    role: 'implementer',
    phase: 'research',
  })
  await appendStageManifestEntry(
    config,
    createStageEntry({
      stage: 'implementer',
      phase: 'research',
      status: 'passed',
      model: config.roleModels.implementer.model,
      startedAt: researchRun.startedAt,
      endedAt: researchRun.endedAt,
      llmCalls: researchRun.llmCallTraces.length,
      toolCalls: researchRun.toolCalls,
      failedToolCalls: researchRun.failedToolCalls,
      transcriptPath: relative(config.runOutputDir, researchTranscript).replace(/\\/g, '/'),
      message: 'implementer research',
    })
  )
  const writeRun = await runRole({
    llm,
    config,
    workspace,
    audit,
    toolState,
    stage: stageContext('implementer', undefined, { phase: 'write' }),
    systemPrompt: IMPLEMENTER_SYSTEM_PROMPT,
    userInstruction: buildImplementerWriteInstruction(researchRun.content),
    roleName: 'implementer',
    logger,
    budgetState,
    recordStage: false,
    tools: IMPLEMENTER_WRITE_TOOLS,
    toolCallPolicy: {
      requiredToolNames: ['write_generated_java_file'],
      minimumNativeToolCalls: 1,
      pseudoToolCallsAreFatal: true,
      disallowConversationalFinalContent: true,
    },
    runEvents: events,
  })
  const writeTranscript = roleTranscriptPath({
    runOutputDir: config.runOutputDir,
    role: 'implementer',
    phase: 'write',
  })
  const writeAuditSlice = audit.slice(auditAfterResearch)
  const successfulWrites = writeAuditSlice.filter(
    entry => entry.ok !== false && entry.tool.startsWith('write')
  ).length
  await appendStageManifestEntry(
    config,
    createStageEntry({
      stage: 'implementer',
      phase: 'write',
      status: 'passed',
      model: config.roleModels.implementer.model,
      startedAt: writeRun.startedAt,
      endedAt: writeRun.endedAt,
      llmCalls: writeRun.llmCallTraces.length,
      toolCalls: writeRun.toolCalls,
      failedToolCalls: writeRun.failedToolCalls,
      successfulWriteCalls: successfulWrites,
      policyFailures: writeRun.policyFailures.length > 0 ? writeRun.policyFailures : undefined,
      transcriptPath: relative(config.runOutputDir, writeTranscript).replace(/\\/g, '/'),
      message: 'implementer write',
    })
  )
  const markdown = [
    '# Implementer Research',
    '',
    researchRun.content,
    '',
    '# Implementer Write',
    '',
    writeRun.content,
  ].join('\n')
  await writeFile(workspace.implementationLogPath, markdown, 'utf8')
  await appendFile(
    workspace.implementationLogPath,
    renderDeterministicImplementerWriteSummary(audit.slice(auditStart)),
    'utf8'
  )
  const report = await validateImplementationArtifacts({
    config,
    role: 'implementer',
    roleOutput: markdown,
    auditEntries: audit.slice(auditStart),
    policyFailures: [...researchRun.policyFailures, ...writeRun.policyFailures],
    toolState,
  })
  await appendStageManifestEntry(
    config,
    createStageEntry({
      stage: 'implementer',
      status: report.status,
      model: config.roleModels.implementer.model,
      startedAt: researchRun.startedAt,
      endedAt: writeRun.endedAt,
      llmCalls: researchRun.llmCallTraces.length + writeRun.llmCallTraces.length,
      toolCalls: researchRun.toolCalls + writeRun.toolCalls,
      failedToolCalls: researchRun.failedToolCalls + writeRun.failedToolCalls,
      artifact: report.reportPath,
      message: report.status === 'passed' ? 'implementation artifacts validated' : report.findings.join('; '),
    })
  )
  const evDone = await events.emit({
    kind: 'stage.completed',
    role: 'implementer',
    status: report.status === 'passed' ? 'passed' : 'failed',
    summary: report.status === 'passed' ? 'Implementer completed' : 'Implementer blocked',
    artifactPaths: [report.reportPath],
    details: {
      findings: report.findings.join('; '),
    },
  })
  await appendRunLog(workspace.runLogPath, {
    title: report.status === 'passed' ? 'Implementer completed' : 'Implementer blocked',
    sourceEventId: evDone.eventId,
    details: { artifactReport: report.reportPath, findings: report.findings },
  })
  logger.info('implementer_done', { status: report.status })
  return report
}

function renderDeterministicImplementerWriteSummary(slice: ToolAuditEntry[]): string {
  const writes = slice.filter(e => e.ok !== false && e.tool.startsWith('write'))
  const failed = slice.filter(e => e.ok === false && e.tool.startsWith('write'))
  const genJava = writes.filter(
    e => e.tool === 'write_generated_java' || e.tool === 'write_generated_java_file'
  ).length
  const paths = writes
    .flatMap(e => e.sourcePaths)
    .map(p => p.replace(/\\/g, '/'))
  const uniquePaths = [...new Set(paths)]
  return [
    '\n## Deterministic Write Summary\n',
    '',
    `- successful write tools: ${writes.length}`,
    `- generated Java writes: ${genJava}`,
    `- failed write tools: ${failed.length}`,
    `- files written:`,
    ...uniquePaths.map(p => `  - ${p}`),
    '',
  ].join('\n')
}

async function runRepair(
  llm: LLMClient,
  config: GeneratorRunConfig,
  workspace: GeneratorWorkspace,
  audit: ToolAuditEntry[],
  toolState: ToolExecutionState,
  gateResults: GateResult[],
  attempt: number,
  logger: GeneratorLogger,
  budgetState: LlmBudgetState,
  events: RunEventWriter,
  repairTraceRows: RepairTraceRow[]
): Promise<Awaited<ReturnType<typeof validateImplementationArtifacts>>> {
  const failedNames = gateFailureNames(gateResults)
  const evRepairStart = await events.emit({
    kind: 'stage.started',
    role: 'repair',
    attempt,
    status: 'started',
    summary: `Repair attempt ${attempt} started`,
    details: { failedGates: failedNames },
  })
  await appendRunLog(workspace.runLogPath, {
    title: `Repair attempt ${attempt} started`,
    sourceEventId: evRepairStart.eventId,
    details: { failedGates: failedNames },
  })
  await writeFile(
    join(config.runOutputDir, 'build-reports', `failed-gates-attempt-${attempt}.json`),
    JSON.stringify(gateResults, null, 2),
    'utf8'
  )
  await writeFile(
    join(config.runOutputDir, 'build-reports', `failure-classification-attempt-${attempt}.md`),
    renderGateFailureClassification(gateResults),
    'utf8'
  )
  const repairFocusPath = join(config.runOutputDir, 'build-reports', `repair-focus-attempt-${attempt}.md`)
  const repairFocusPacket = await writeRepairFocusPacket({
    config,
    gateResults,
    attempt,
    outputPath: repairFocusPath,
  })
  logger.warn('repair_start', { attempt })
  const auditStart = audit.length
  const repairRequirement = repairRequiresWrite(gateResults)
  await events.emit({
    kind: 'repair.requirement',
    role: 'repair',
    attempt,
    status: repairRequirement.required ? 'passed' : 'skipped',
    summary: repairRequirement.reason,
    details: {
      target: repairRequirement.target,
      drivingGates: repairRequirement.drivingGates,
      requiredToolNames: repairRequirement.requiredToolNames,
    },
  })
  const requiredReadPaths = repairFocusPacket.excerpts
    .map(excerpt => excerpt.runRelativePath)
    .filter(path => path.endsWith('.java'))
  const repairResearchInstruction = [
    `Research repair attempt ${attempt}.`,
    `Repair write required: ${repairRequirement.required ? 'yes' : 'no'} (${repairRequirement.reason}).`,
    `Repair target: ${repairRequirement.target}.`,
    'Use repair-focus-attempt context as primary evidence.',
    'Use Maven/JAR/Rosetta errors first, then diagnostic findings.',
    'Do not write files in this phase. Produce a concise patch plan with exact files that need mutation.',
  ].join('\n')
  const repairResearchExtraPaths = [
    join(config.runOutputDir, 'build-reports', `failed-gates-attempt-${attempt}.json`),
    join(config.runOutputDir, 'build-reports', `failure-classification-attempt-${attempt}.md`),
    repairFocusPath,
  ]
  const runRepairResearch = (contextTier: RoleContextTier) =>
    runRole({
      llm,
      config,
      workspace,
      audit,
      toolState,
      stage: stageContext('repair', undefined, { attempt, phase: 'research' }),
      systemPrompt: REPAIR_SYSTEM_PROMPT,
      userInstruction: repairResearchInstruction,
      extraPaths: repairResearchExtraPaths,
      contextTier,
      roleName: 'repair',
      logger,
      budgetState,
      recordStage: false,
      tools: REPAIR_RESEARCH_TOOLS,
      toolCallPolicy: {
        pseudoToolCallsAreFatal: true,
        requiredToolNames: requiredReadPaths.length > 0 ? ['read_file'] : undefined,
        requiredReadPaths,
      },
      runEvents: events,
    })
  const researchRun = await runRolePhaseWithContextFallback(
    () => runRepairResearch('full'),
    () => runRepairResearch('compact'),
    logger,
    `repair-research-${String(attempt)}`
  )
  const researchTranscript = roleTranscriptPath({
    runOutputDir: config.runOutputDir,
    role: 'repair',
    attempt,
    phase: 'research',
  })
  await appendStageManifestEntry(
    config,
    createStageEntry({
      stage: 'repair',
      attempt,
      phase: 'research',
      status: 'passed',
      model: config.roleModels.repair.model,
      startedAt: researchRun.startedAt,
      endedAt: researchRun.endedAt,
      llmCalls: researchRun.llmCallTraces.length,
      toolCalls: researchRun.toolCalls,
      failedToolCalls: researchRun.failedToolCalls,
      transcriptPath: relative(config.runOutputDir, researchTranscript).replace(/\\/g, '/'),
      message: `repair attempt ${attempt} research`,
    })
  )
  const auditAfterResearch = audit.length
  const writeTranscript = roleTranscriptPath({
    runOutputDir: config.runOutputDir,
    role: 'repair',
    attempt,
    phase: 'write',
  })
  let writeRun: RoleRun
  if (repairRequirement.required && repairRequirement.allowedWritePaths.length === 0) {
    writeRun = syntheticRoleRun(
      'BLOCKED: orchestrator_repair_not_possible (no allowed write paths for this target).',
      ['orchestrator_repair_not_possible']
    )
    await mkdir(dirname(writeTranscript), { recursive: true })
    await writeFile(writeTranscript, writeRun.content, 'utf8')
    const relW = relative(config.runOutputDir, writeTranscript).replace(/\\/g, '/')
    await events.emit({
      kind: 'role.phase.started',
      role: 'repair',
      attempt,
      phase: 'write',
      status: 'started',
    })
    await events.emit({
      kind: 'role.phase.completed',
      role: 'repair',
      attempt,
      phase: 'write',
      status: 'blocked',
      artifactPaths: [relW],
    })
  } else {
    const repairWriteExtraPaths = [
      join(config.runOutputDir, 'build-reports', `failed-gates-attempt-${attempt}.json`),
      repairFocusPath,
    ]
    const runRepairWrite = (contextTier: RoleContextTier) =>
      runRole({
        llm,
        config,
        workspace,
        audit,
        toolState,
        stage: stageContext('repair', undefined, {
          attempt,
          phase: 'write',
          extraAllowedWritePaths: repairRequirement.allowedWritePaths,
        }),
        systemPrompt: REPAIR_SYSTEM_PROMPT,
        userInstruction: buildRepairWriteInstruction({
          attempt,
          repairRequirement,
          researchSummary: researchRun.content,
          firstFailedGateNames: failedNames,
        }),
        extraPaths: repairWriteExtraPaths,
        contextTier,
        roleName: 'repair',
        logger,
        budgetState,
        recordStage: false,
        tools: REPAIR_WRITE_TOOLS,
        toolCallPolicy:
          repairRequirement.required
            ? {
              requiredToolNames: repairRequirement.requiredToolNames,
              minimumNativeToolCalls: 1,
              pseudoToolCallsAreFatal: true,
              disallowConversationalFinalContent: true,
            }
            : { pseudoToolCallsAreFatal: true },
        runEvents: events,
      })
    writeRun = await runRolePhaseWithContextFallback(
      () => runRepairWrite('full'),
      () => runRepairWrite('compact'),
      logger,
      `repair-write-${String(attempt)}`
    )
  }
  const writeAuditSlice = repairRequirement.required && repairRequirement.allowedWritePaths.length === 0
    ? []
    : audit.slice(auditAfterResearch)
  const successfulRepairWrites = writeAuditSlice.filter(
    entry => entry.ok !== false && entry.tool.startsWith('write')
  ).length
  await appendStageManifestEntry(
    config,
    createStageEntry({
      stage: 'repair',
      attempt,
      phase: 'write',
      status: writeRun.policyFailures.includes('orchestrator_repair_not_possible') ? 'failed' : 'passed',
      model: config.roleModels.repair.model,
      startedAt: writeRun.startedAt,
      endedAt: writeRun.endedAt,
      llmCalls: writeRun.llmCallTraces.length,
      toolCalls: writeRun.toolCalls,
      failedToolCalls: writeRun.failedToolCalls,
      successfulWriteCalls: successfulRepairWrites,
      policyFailures: writeRun.policyFailures.length > 0 ? writeRun.policyFailures : undefined,
      transcriptPath: relative(config.runOutputDir, writeTranscript).replace(/\\/g, '/'),
      message: `repair attempt ${attempt} write`,
    })
  )
  const markdown = [
    `# Repair Research Attempt ${attempt}`,
    '',
    researchRun.content,
    '',
    `# Repair Write Attempt ${attempt}`,
    '',
    writeRun.content,
  ].join('\n')
  const attemptPad = String(attempt).padStart(2, '0')
  const attemptLogPath = join(workspace.rootDir, `repair-attempt-${attemptPad}.md`)
  await writeFile(attemptLogPath, `${markdown}\n`, 'utf8')
  await appendFile(
    workspace.repairLogPath,
    [
      `\n## Attempt ${attempt}`,
      '',
      `- log: ${relative(config.runOutputDir, attemptLogPath).replace(/\\/g, '/')}`,
      '',
    ].join('\n'),
    'utf8'
  )
  const report = await validateImplementationArtifacts({
    config,
    role: 'repair',
    attempt,
    roleOutput: markdown,
    auditEntries: audit.slice(auditStart),
    policyFailures: [...researchRun.policyFailures, ...writeRun.policyFailures],
    repairWriteRequirement: repairRequirement,
    toolState,
  })
  await appendFile(
    workspace.repairLogPath,
    [
      `- report: ${relative(config.runOutputDir, report.reportPath).replace(/\\/g, '/')}`,
      `- status: ${report.status}`,
      '',
    ].join('\n'),
    'utf8'
  )
  await appendStageManifestEntry(
    config,
    createStageEntry({
      stage: 'repair',
      attempt,
      status: report.status,
      model: config.roleModels.repair.model,
      startedAt: researchRun.startedAt,
      endedAt: writeRun.endedAt,
      llmCalls: researchRun.llmCallTraces.length + writeRun.llmCallTraces.length,
      toolCalls: researchRun.toolCalls + writeRun.toolCalls,
      failedToolCalls: researchRun.failedToolCalls + writeRun.failedToolCalls,
      artifact: report.reportPath,
      message: report.status === 'passed' ? 'repair artifacts validated' : report.findings.join('; '),
    })
  )
  repairTraceRows.push({
    attempt,
    drivingGates: repairRequirement.drivingGates,
    target: repairRequirement.target,
    status: report.status,
    logPath: `agent-workspace/repair-attempt-${attemptPad}.md`,
  })
  await writeRunTraceIndex(config, repairTraceRows)
  logger.info('repair_done', { attempt, status: report.status })
  return report
}

function syntheticRoleRun(content: string, policyFailures: string[]): RoleRun {
  const now = new Date().toISOString()
  return {
    content,
    startedAt: now,
    endedAt: now,
    toolCalls: 0,
    failedToolCalls: 0,
    cachedToolCalls: 0,
    inputChars: 0,
    outputChars: content.length,
    llmCalls: 0,
    durationMs: 0,
    policyFailures,
    llmCallTraces: [],
  }
}

function isRepairableImplementationArtifactFailure(
  report: Awaited<ReturnType<typeof validateImplementationArtifacts>>
): boolean {
  const repairable = new Set([
    'missing_required_entry_class',
    'write_tool_failed_path',
    'write_tool_failed_package',
    'write_tool_failed_class',
  ])
  return report.classifications.some(classification => repairable.has(classification))
    || report.findings.some(finding =>
      finding.includes('mapFile must return String')
      || finding.includes('mapFile must accept Path inputPath')
      || finding.includes('mapFile throws clause must include Exception')
      || finding.includes('GeneratedFpmlToCdmMapper must')
    )
}

function buildDeterministicBuildReview(
  config: GeneratorRunConfig,
  gateResults: GateResult[],
  promoted: boolean
): string {
  const failed = gateResults.filter(gate => gate.status === 'failed')
  const authoritativeFailures = failed.filter(gate => describeGateAuthority(gate) !== 'diagnostic')
  const diagnosticFindings = failed.filter(gate => describeGateAuthority(gate) === 'diagnostic')
  return `# Final Build Report

Status: ${promoted ? 'promoted' : 'blocked'}
Run id: ${config.runId}

${renderGateFailureClassification(gateResults)}

## Failed Gates

${failed.length === 0 ? '- none' : failed.map(gate => `- ${gate.name} (${describeGateAuthority(gate)}): ${gate.outputSnippet}`).join('\n')}

## Authoritative And Pipeline Failures

${authoritativeFailures.length === 0 ? '- none' : authoritativeFailures.map(gate => `- ${gate.name}: ${gate.outputSnippet}`).join('\n')}

## Diagnostic Findings

${diagnosticFindings.length === 0 ? '- none' : diagnosticFindings.map(gate => `- ${gate.name}: ${gate.outputSnippet}`).join('\n')}
`
}

async function runAndLogGates(
  config: GeneratorRunConfig,
  workspace: GeneratorWorkspace,
  logger: GeneratorLogger,
  events: RunEventWriter,
  audit: ToolAuditEntry[]
): Promise<GateResult[]> {
  const evG = await events.emit({
    kind: 'gate.run.started',
    phase: 'gates',
    status: 'started',
    summary: 'Gates started',
  })
  await appendRunLog(workspace.runLogPath, { title: 'Gates started', sourceEventId: evG.eventId })
  logger.info('gates_start')
  await writeToolAuditLog(config, audit)
  const results = await runGates(config)
  const failed = gateFailureNames(results)
  const evDone = await events.emit({
    kind: 'gate.run.completed',
    phase: 'gates',
    status: failed.length === 0 ? 'passed' : 'failed',
    summary: 'Gates completed',
    details: { failedGates: failed },
  })
  await appendRunLog(workspace.runLogPath, {
    title: 'Gates completed',
    sourceEventId: evDone.eventId,
    details: { failedGates: failed },
  })
  logger.info('gates_done', {
    total: results.length,
    failed: failed.length,
  })
  return results
}

async function writeFinalBlockedReports(
  config: GeneratorRunConfig,
  workspace: GeneratorWorkspace,
  audit: ToolAuditEntry[],
  gateResults: GateResult[],
  logger: GeneratorLogger,
  promoted = false,
  events?: RunEventWriter,
  repairTraceRows: RepairTraceRow[] = []
): Promise<void> {
  await writeFile(
    join(config.runOutputDir, 'build-reports', 'final-gates.json'),
    JSON.stringify(gateResults, null, 2),
    'utf8'
  )
  await writeFile(
    join(config.runOutputDir, 'build-reports', 'failure-classification.md'),
    renderGateFailureClassification(gateResults),
    'utf8'
  )
  const buildReview = `${buildDeterministicBuildReview(config, gateResults, promoted)}\n\n${renderAgentLoopSummary({ audit, gateResults })}`
  await writeFinalBuildReport({
    config,
    gateResults,
    promoted,
    markdown: buildReview,
  })
  await writeGoodJavaGuaranteeReview({
    config,
    workspace,
    gateResults,
    promoted,
  })
  await writeToolAuditLog(config, audit)
  await writeRunTraceIndex(config, repairTraceRows)
  const failed = gateFailureNames(gateResults)
  const evFinal = await events?.emit({
    kind: 'run.completed',
    status: promoted ? 'passed' : failed.length === 0 ? 'passed' : 'failed',
    summary: promoted ? 'Jar promoted' : 'Build finished',
    details: { failedGates: failed, promoted },
  })
  await appendRunLog(workspace.runLogPath, {
    title: promoted ? 'Jar promoted' : 'Build blocked',
    sourceEventId: evFinal?.eventId,
    details: { failedGates: failed },
  })
  logger.info('run_done', { promoted })
}

type RoleRun = {
  content: string
  startedAt: string
  endedAt: string
  toolCalls: number
  failedToolCalls: number
  cachedToolCalls: number
  inputChars: number
  outputChars: number
  llmCalls: number
  durationMs: number
  policyFailures: string[]
  llmCallTraces: LlmCallTrace[]
}

function buildImplementerWriteInstruction(researchSummary: string): string {
  return `Now write files. You have only write tools.
Call write_generated_java_file for each generated Java source file.
The first required call must write:
src/main/java/com/fpml/cdm/fx/mapper/generated/GeneratedFpmlToCdmMapper.java

The generated mapper skeleton already exists. Patch it and preserve this exact public contract:

\`\`\`java
package com.fpml.cdm.fx.mapper.generated;

import com.fpml.cdm.fx.mapper.FpmlToCdmMapper;
import java.nio.file.Path;

public class GeneratedFpmlToCdmMapper implements FpmlToCdmMapper {
    @Override
    public String mapFile(Path inputPath, Path reportsDir) throws Exception {
        // parse inputPath, build TradeState internally, return serialized CDM JSON String
    }
}
\`\`\`

Runtime contract:
- mapFile must return String, not TradeState.
- mapFile must accept Path inputPath, Path reportsDir.
- mapFile must throw Exception.
- Build TradeState in private helpers such as mapTradeState(...).
- Serialize TradeState with Jackson at the runtime boundary.
- Do not change the package, class name, implemented interface, or mapFile signature.
- Use write_file, not write_generated_java_file, for src/test/java/** and reports/**.

## Required Write Tool

Use this native tool call shape:

tool: write_generated_java_file
arguments:
{
  "path": "src/main/java/com/fpml/cdm/fx/mapper/generated/GeneratedFpmlToCdmMapper.java",
  "content": "package com.fpml.cdm.fx.mapper.generated;\\n..."
}

Rules:
- path must be run-relative
- path must be under src/main/java/com/fpml/cdm/fx/mapper/generated/
- content package must match path
- class name must match file name
- do not include generated/java-mapper-poc/runs/... in path

Do not emit Markdown source blocks instead of tool calls.

## Research Summary

${researchSummary}`
}

function buildRepairWriteInstruction(args: {
  attempt: number
  repairRequirement: RepairWriteRequirement
  researchSummary: string
  firstFailedGateNames: string[]
}): string {
  const header = [
    `Repair attempt: ${args.attempt}`,
    `Failed gates: ${args.firstFailedGateNames.join(', ') || 'none'}`,
    `Repair target: ${args.repairRequirement.target}`,
    `Driving gates: ${args.repairRequirement.drivingGates.join(', ') || 'none'}`,
    `Required write tools: ${args.repairRequirement.requiredToolNames.join(', ') || 'none'}`,
    `Allowed write paths: ${args.repairRequirement.allowedWritePaths.join(', ') || 'none'}`,
  ].join('\n')
  return `${header}

Now patch files for repair attempt ${args.attempt}. You have only write tools.
Repair write required: ${args.repairRequirement.required ? 'yes' : 'no'} (${args.repairRequirement.reason}).

Rules:
- Use Maven/JAR/Rosetta errors as the primary source of truth.
- Use diagnostic findings only as repair hints.
- If Java source is affected, call write_generated_java_file for each patched generated Java source file.
- For POM or build configuration, call write_file with a run-relative path such as pom.xml.
- Do not claim a file was patched unless the write tool returns success.
- If the source of truth is insufficient, write no narrative success claim; state BLOCKED.
- Do not emit Markdown source blocks instead of tool calls.

## Research Summary

${args.researchSummary}`
}

async function runRole(args: {
  llm: LLMClient
  config: GeneratorRunConfig
  workspace: GeneratorWorkspace
  audit: ToolAuditEntry[]
  toolState: ToolExecutionState
  stage: ActiveStageContext
  systemPrompt: string
  userInstruction: string
  extraPaths?: string[]
  contextTier?: RoleContextTier
  roleName: GeneratorRole
  logger: GeneratorLogger
  budgetState: LlmBudgetState
  recordStage?: boolean
  tools?: LLMTool[]
  maxToolRoundsOverride?: number
  toolCallPolicy?: ToolCallPolicy
  runEvents: RunEventWriter
}): Promise<RoleRun> {
  args.logger.info('role_start', { role: args.roleName })
  const startedAt = new Date()
  const auditStart = args.audit.length
  const messages = await buildRoleMessages({
    systemPrompt: args.systemPrompt,
    config: args.config,
    workspace: args.workspace,
    userInstruction: args.userInstruction,
    roleName: args.roleName,
    extraPaths: args.extraPaths,
    contextTier: args.contextTier ?? 'full',
  })
  const roleModel = args.config.roleModels[args.roleName]
  if (args.stage.phase !== undefined) {
    await args.runEvents.emit({
      kind: 'role.phase.started',
      role: args.roleName,
      round: args.stage.round,
      attempt: args.stage.attempt,
      phase: args.stage.phase,
      status: 'started',
    })
  }
  const output = await callRoleWithTools({
    llm: args.llm,
    messages,
    tools: args.tools ?? GENERATOR_LLM_TOOLS,
    model: roleModel.model,
    fallbackModel: roleModel.fallbackModel,
    maxTokens: roleModel.maxTokens,
    maxToolRounds: args.maxToolRoundsOverride ?? roleModel.maxToolRounds,
    maxTotalLlmCalls: Math.max(0, args.budgetState.maxTotalCalls - args.budgetState.usedCalls),
    maxInputTokensPerCall: args.budgetState.maxInputTokensPerCall,
    logger: args.logger,
    roleName: args.roleName,
    toolCallPolicy: args.toolCallPolicy,
    llmTrace: { runOutputDir: args.config.runOutputDir },
    executeTool: (name, input) =>
      executeGeneratorTool(
        {
          config: args.config,
          audit: args.audit,
          state: args.toolState,
          stage: args.stage,
          runEvents: args.runEvents,
        },
        name,
        input
      ),
  })
  const endedAt = new Date()
  args.budgetState.usedCalls += output.llmCalls
  const auditSlice = args.audit.slice(auditStart)
  const failedToolCalls = auditSlice.filter(entry => entry.ok === false).length
  const cachedToolCalls = auditSlice.filter(entry => entry.cacheStatus === 'hit').length
  const startedAtIso = startedAt.toISOString()
  const endedAtIso = endedAt.toISOString()
  if (args.stage.phase !== undefined) {
    const transcriptAbs = roleTranscriptPath({
      runOutputDir: args.config.runOutputDir,
      role: args.roleName,
      round: args.stage.round,
      attempt: args.stage.attempt,
      phase: args.stage.phase,
    })
    await mkdir(dirname(transcriptAbs), { recursive: true })
    await writeFile(transcriptAbs, output.content, 'utf8')
    const relTranscript = relative(args.config.runOutputDir, transcriptAbs).replace(/\\/g, '/')
    await args.runEvents.emit({
      kind: 'role.phase.completed',
      role: args.roleName,
      round: args.stage.round,
      attempt: args.stage.attempt,
      phase: args.stage.phase,
      status: 'passed',
      artifactPaths: [relTranscript],
    })
  }
  if (args.recordStage !== false) {
    await appendStageManifestEntry(
      args.config,
      createStageEntry({
        stage: args.roleName,
        round: args.stage.round,
        status: 'passed',
        model: roleModel.model,
        startedAt: startedAtIso,
        endedAt: endedAtIso,
        toolCalls: auditSlice.length,
        failedToolCalls,
        message: `outputChars=${output.content.length}`,
      })
    )
  }
  await appendCostLedgerEntry(args.config, {
    role: args.roleName,
    round: args.stage.round,
    model: roleModel.model,
    inputChars: output.inputChars,
    outputChars: output.outputChars,
    llmCalls: output.llmCalls,
    toolCalls: auditSlice.length,
    cachedToolCalls,
    failedToolCalls,
    durationMs: endedAt.getTime() - startedAt.getTime(),
  })
  args.logger.info('role_done', { role: args.roleName, outputChars: output.content.length })
  return {
    content: output.content,
    startedAt: startedAtIso,
    endedAt: endedAtIso,
    toolCalls: auditSlice.length,
    failedToolCalls,
    cachedToolCalls,
    inputChars: output.inputChars,
    outputChars: output.outputChars,
    llmCalls: output.llmCalls,
    durationMs: endedAt.getTime() - startedAt.getTime(),
    policyFailures: output.policyFailures,
    llmCallTraces: output.llmCallTraces,
  }
}

function createLlmBudgetState(config: GeneratorRunConfig): LlmBudgetState {
  const configured = config.llmBudget
  return {
    maxTotalCalls: configured?.maxTotalCalls ?? 200,
    maxInputTokensPerCall: configured?.maxInputTokensPerCall ?? 128_000,
    maxRepairAttempts: configured?.maxRepairAttempts ?? Math.min(config.maxRepairAttempts, 2),
    usedCalls: 0,
  }
}

function stageContext(
  role: ActiveStageContext['role'],
  round?: number,
  options?: {
    attempt?: number
    phase?: RolePhase
    extraAllowedWritePaths?: string[]
  }
): ActiveStageContext {
  const base = allowedWritesFor(role, round)
  const extra = options?.extraAllowedWritePaths ?? []
  return {
    role,
    round,
    attempt: options?.attempt,
    phase: options?.phase,
    allowedWritePaths: [...base, ...extra],
  }
}

function allowedWritesFor(role: ActiveStageContext['role'], round?: number): string[] {
  const paddedRound = round === undefined ? undefined : String(round).padStart(2, '0')
  if (role === 'planner' && paddedRound) {
    return [`agent-workspace/round-${paddedRound}/planner-plan.md`]
  }
  if (role === 'critic' && paddedRound) {
    return [`agent-workspace/round-${paddedRound}/critic-review.md`]
  }
  if (role === 'critique-reviewer' && paddedRound) {
    return [`agent-workspace/round-${paddedRound}/critique-resolution.md`]
  }
  if (role === 'implementer') {
    return [
      'src/main/java/com/fpml/cdm/fx/mapper/generated/**',
      'src/test/java/**',
      'fixtures/**',
      'expected/**',
      'reports/**',
      'agent-workspace/implementation-log.md',
      'agent-workspace/implementation-plan.md',
    ]
  }
  if (role === 'repair') {
    return [
      'src/main/java/com/fpml/cdm/fx/mapper/generated/**',
      'src/test/java/**',
      'reports/**',
      'agent-workspace/repair-log.md',
    ]
  }
  return []
}

function previousRoundFeedbackPaths(workspace: GeneratorWorkspace, round: number): string[] {
  if (round <= 1) return []
  const previous = join(workspace.rootDir, `round-${String(round - 1).padStart(2, '0')}`)
  return [
    join(previous, 'round-summary.md'),
    join(previous, 'planner-plan.md'),
    join(previous, 'critic-review.md'),
    join(previous, 'critique-resolution.md'),
    join(previous, 'plan-validation.md'),
  ]
}

/** Lighter than {@link previousRoundFeedbackPaths}: one summary file for token recovery passes. */
function previousRoundFeedbackPathsCompact(workspace: GeneratorWorkspace, round: number): string[] {
  if (round <= 1) return []
  const previous = join(workspace.rootDir, `round-${String(round - 1).padStart(2, '0')}`)
  return [join(previous, 'round-summary.md')]
}

function isRecoverableContextOverflowError(error: unknown): boolean {
  if (error instanceof LLMContextLengthError) return true
  if (error instanceof LLMHTTPError && error.status === 400) {
    const blob = `${error.message}\n${error.bodySnippet}`
    return /context length|maximum context|too many tokens|reduce the length/i.test(blob)
  }
  return false
}

async function runRolePhaseWithContextFallback(
  runFull: () => Promise<RoleRun>,
  runCompact: () => Promise<RoleRun>,
  logger: GeneratorLogger,
  phase: string
): Promise<RoleRun> {
  try {
    return await runFull()
  } catch (error) {
    if (!isRecoverableContextOverflowError(error)) throw error
    logger.warn('llm_context_overflow_retry_compact', { phase })
    return await runCompact()
  }
}

async function clearPlanningRoundArtifacts(rootDir: string, logger: GeneratorLogger): Promise<void> {
  const entries = await readdir(rootDir, { withFileTypes: true })
  let cleared = 0
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    if (!/^round-\d{2}$/u.test(entry.name)) continue
    await rm(join(rootDir, entry.name), { recursive: true, force: true })
    cleared += 1
  }
  if (cleared > 0) {
    logger.info('planning_round_artifacts_cleared', { count: cleared })
  }
}

export function isDeterministicFxForwardPocConfig(config: GeneratorRunConfig): boolean {
  return (
    config.productFamily === 'fx-derivatives'
    && config.runtimeFixtures.length === 1
    && config.runtimeFixtures[0]?.id === 'fx-ex03-fx-fwd'
  )
}

export function shouldRunGatesOnlySmokeFirst(config: GeneratorRunConfig): boolean {
  return config.gatesOnlySmoke === true && !config.requireApproval && isDeterministicFxForwardPocConfig(config)
}

function hasFailures(results: GateResult[]): boolean {
  return results.some(result => result.status === 'failed' && policyForGateName(result.name).feedsRepair)
}
