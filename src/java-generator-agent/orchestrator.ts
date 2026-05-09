import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import type { LLMClient } from '../agent/types'
import type { GeneratorRole } from './types'
import { synthesizeAcceptedPlan } from './accepted-plan'
import { isAcceptedDecision, parsePlanningDecision } from './decision'
import { runGates } from './gates'
import { implementationArtifactGateResult, validateImplementationArtifacts } from './implementation-artifacts'
import { createJavaProjectShell } from './java-shell'
import type { GeneratorLogger } from './logger'
import { createConsoleGeneratorLogger } from './logger'
import { appendRunLog } from './run-log'
import {
  CRITIC_SYSTEM_PROMPT,
  CRITIQUE_REVIEWER_SYSTEM_PROMPT,
  IMPLEMENTER_SYSTEM_PROMPT,
  PLANNER_SYSTEM_PROMPT,
  REPAIR_SYSTEM_PROMPT,
  buildRoleMessages,
} from './prompts'
import { renderGateFailureClassification } from './gate-classification'
import { promoteGeneratedJar } from './promotion'
import { writeRepairFocusPacket } from './repair-focus'
import { writeFinalBuildReport, writeToolAuditLog } from './reports'
import {
  DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
  renderPlanValidation,
  validatePlannerPlan,
} from './plan-validator'
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
import { callRoleWithTools } from './tool-runner'
import {
  createToolExecutionState,
  executeGeneratorTool,
  GENERATOR_LLM_TOOLS,
  IMPLEMENTER_RESEARCH_TOOLS,
  IMPLEMENTER_WRITE_TOOLS,
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
  await mkdir(resolve(args.config.runOutputDir, 'build-reports'), { recursive: true })
  const workspace = await createWorkspace(args.config)
  await createJavaProjectShell(args.config)
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
    const accepted = await runPlanningLoop(args.llm, args.config, workspace, audit, toolState, logger, budgetState)
    if (!accepted) {
      await writeToolAuditLog(args.config, audit)
      throw new Error('Planning did not converge.')
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

    const implementationReport = await runImplementer(args.llm, args.config, workspace, audit, toolState, logger, budgetState)
    if (implementationReport.status === 'failed') {
      const gateResults = [implementationArtifactGateResult(implementationReport)]
      await writeFinalBlockedReports(args.config, workspace, audit, gateResults, logger)
      return
    }
    let gateResults = await runAndLogGates(args.config, workspace, logger)

    for (
      let attempt = 1;
      hasFailures(gateResults) && attempt <= Math.min(args.config.maxRepairAttempts, budgetState.maxRepairAttempts);
      attempt += 1
    ) {
      await runRepair(args.llm, args.config, workspace, audit, toolState, gateResults, attempt, logger, budgetState)
      gateResults = await runAndLogGates(args.config, workspace, logger)
    }

    const promoted = await promoteGeneratedJar(args.config, gateResults)
    await writeFinalBlockedReports(args.config, workspace, audit, gateResults, logger, promoted)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    logger.error('run_failed', { error: message })
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

async function runPlanningLoop(
  llm: LLMClient,
  config: GeneratorRunConfig,
  workspace: GeneratorWorkspace,
  audit: ToolAuditEntry[],
  toolState: ToolExecutionState,
  logger: GeneratorLogger,
  budgetState: LlmBudgetState
): Promise<boolean> {
  const productScope = JSON.parse(await readFile(workspace.productScopeJsonPath, 'utf8')) as ProductScopeGuidance

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

    const plannerRun = await runRole({
      llm,
      config,
      workspace,
      audit,
      toolState,
      stage: stageContext('planner', round),
      systemPrompt: PLANNER_SYSTEM_PROMPT,
      userInstruction:
        round === 1
          ? 'Write the first planner-plan.md for this FX derivatives generator run.'
          : 'Write a revised planner-plan.md using the previous round critique and resolution.',
      extraPaths: previousRoundPaths(workspace, round),
      roleName: 'planner',
      logger,
      budgetState,
    })
    const planner = plannerRun.content
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
    })
    await writeFile(validationPath, renderPlanValidation(validation), 'utf8')
    await writeFile(
      join(roundDir, 'plan-validation.json'),
      JSON.stringify(validation, null, 2),
      'utf8'
    )

    const criticRun = await runRole({
      llm,
      config,
      workspace,
      audit,
      toolState,
      stage: stageContext('critic', round),
      systemPrompt: CRITIC_SYSTEM_PROMPT,
      userInstruction:
        'Review the current planner-plan.md. Use plan-validation.md as deterministic pre-review context.',
      extraPaths: [plannerPath, validationPath],
      roleName: 'critic',
      logger,
      budgetState,
    })
    const critic = criticRun.content
    await writeFile(criticPath, critic, 'utf8')
    logger.info('role_artifact_written', { role: 'critic', round })

    const resolutionRun = await runRole({
      llm,
      config,
      workspace,
      audit,
      toolState,
      stage: stageContext('critique-reviewer', round),
      systemPrompt: CRITIQUE_REVIEWER_SYSTEM_PROMPT,
      userInstruction: [
        'Resolve the critic review and decide whether this planning round is accepted.',
        `Planning round: ${round}/${config.maxPlanningRounds}.`,
        round === config.maxPlanningRounds
          ? 'This is the final planning round. Accept with conditions for non-blocking issues; fail only for true blockers.'
          : 'More planning rounds remain if blocking issues are fixable.',
      ].join('\n'),
      extraPaths: [plannerPath, criticPath, validationPath],
      roleName: 'critique-reviewer',
      logger,
      budgetState,
    })
    const resolution = resolutionRun.content
    await writeFile(resolutionPath, resolution, 'utf8')
    logger.info('role_artifact_written', { role: 'critique-reviewer', round })

    const summaryPath = join(roundDir, 'round-summary.md')
    await writeRoundSummary({ round, plannerPath, criticPath, resolutionPath, outputPath: summaryPath })

    const decision = parsePlanningDecision(resolution)
    if (decision === 'failed') {
      await appendRunLog(workspace.runLogPath, {
        title: `Planning failed terminally in round ${round}`,
        details: { resolutionPath },
      })
      throw new Error(`Planning failed terminally in round ${round}; see ${resolutionPath}.`)
    }

    if (decision === 'accepted' && validation.status === 'passed') {
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
  budgetState: LlmBudgetState
): Promise<Awaited<ReturnType<typeof validateImplementationArtifacts>>> {
  await appendRunLog(workspace.runLogPath, { title: 'Implementer started' })
  logger.info('implementer_start')
  const auditStart = audit.length
  const researchRun = await runRole({
    llm,
    config,
    workspace,
    audit,
    toolState,
    stage: stageContext('implementer'),
    systemPrompt: IMPLEMENTER_SYSTEM_PROMPT,
    userInstruction:
      'Research the implementation now. Use read/context tools only. Produce a concise file manifest and implementation outline; do not include Java source and do not write pseudo tool calls.',
    roleName: 'implementer',
    logger,
    budgetState,
    recordStage: false,
    tools: IMPLEMENTER_RESEARCH_TOOLS,
    maxToolRoundsOverride: Math.min(3, config.roleModels.implementer.maxToolRounds),
    toolCallPolicy: { pseudoToolCallsAreFatal: true },
  })
  const writeRun = await runRole({
    llm,
    config,
    workspace,
    audit,
    toolState,
    stage: stageContext('implementer'),
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
    },
  })
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
  const report = await validateImplementationArtifacts({
    config,
    role: 'implementer',
    roleOutput: markdown,
    auditEntries: audit.slice(auditStart),
    policyFailures: [...researchRun.policyFailures, ...writeRun.policyFailures],
  })
  await appendStageManifestEntry(
    config,
    createStageEntry({
      stage: 'implementer',
      status: report.status,
      model: config.roleModels.implementer.model,
      startedAt: researchRun.startedAt,
      endedAt: writeRun.endedAt,
      toolCalls: researchRun.toolCalls + writeRun.toolCalls,
      failedToolCalls: researchRun.failedToolCalls + writeRun.failedToolCalls,
      artifact: report.reportPath,
      message: report.status === 'passed' ? 'implementation artifacts validated' : report.findings.join('; '),
    })
  )
  await appendRunLog(workspace.runLogPath, {
    title: report.status === 'passed' ? 'Implementer completed' : 'Implementer blocked',
    details: { artifactReport: report.reportPath, findings: report.findings },
  })
  logger.info('implementer_done', { status: report.status })
  return report
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
  budgetState: LlmBudgetState
): Promise<void> {
  await appendRunLog(workspace.runLogPath, {
    title: `Repair attempt ${attempt} started`,
    details: { failedGates: gateResults.filter(gate => gate.status === 'failed').map(gate => gate.name) },
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
  await writeRepairFocusPacket({
    config,
    gateResults,
    attempt,
    outputPath: repairFocusPath,
  })
  logger.warn('repair_start', { attempt })
  const auditStart = audit.length
  const roleRun = await runRole({
    llm,
    config,
    workspace,
    audit,
    toolState,
    stage: stageContext('repair'),
    systemPrompt: REPAIR_SYSTEM_PROMPT,
    userInstruction: `Repair failed gates for attempt ${attempt}. Use repair-focus-attempt-${attempt}.md as the primary context. Patch only the focused issue and use write_generated_java_file for affected generated Java classes.`,
    extraPaths: [
      join(config.runOutputDir, 'build-reports', `failed-gates-attempt-${attempt}.json`),
      join(config.runOutputDir, 'build-reports', `failure-classification-attempt-${attempt}.md`),
      repairFocusPath,
    ],
    roleName: 'repair',
    logger,
    budgetState,
    recordStage: false,
    tools: GENERATOR_LLM_TOOLS,
    toolCallPolicy: { pseudoToolCallsAreFatal: true },
  })
  const markdown = roleRun.content
  await writeFile(workspace.repairLogPath, `${markdown}\n`, 'utf8')
  const report = await validateImplementationArtifacts({
    config,
    role: 'repair',
    roleOutput: markdown,
    auditEntries: audit.slice(auditStart),
    policyFailures: roleRun.policyFailures,
  })
  await appendStageManifestEntry(
    config,
    createStageEntry({
      stage: 'repair',
      round: attempt,
      status: report.status,
      model: config.roleModels.repair.model,
      startedAt: roleRun.startedAt,
      endedAt: roleRun.endedAt,
      toolCalls: roleRun.toolCalls,
      failedToolCalls: roleRun.failedToolCalls,
      artifact: report.reportPath,
      message: report.status === 'passed' ? 'repair artifacts validated' : report.findings.join('; '),
    })
  )
  logger.info('repair_done', { attempt, status: report.status })
}

function buildDeterministicBuildReview(
  config: GeneratorRunConfig,
  gateResults: GateResult[],
  promoted: boolean
): string {
  const failed = gateResults.filter(gate => gate.status === 'failed')
  return `# Final Build Report

Status: ${promoted ? 'promoted' : 'blocked'}
Run id: ${config.runId}

${renderGateFailureClassification(gateResults)}

## Failed Gates

${failed.length === 0 ? '- none' : failed.map(gate => `- ${gate.name}: ${gate.outputSnippet}`).join('\n')}
`
}

async function runAndLogGates(
  config: GeneratorRunConfig,
  workspace: GeneratorWorkspace,
  logger: GeneratorLogger
): Promise<GateResult[]> {
  await appendRunLog(workspace.runLogPath, { title: 'Gates started' })
  logger.info('gates_start')
  const results = await runGates(config)
  await appendRunLog(workspace.runLogPath, {
    title: 'Gates completed',
    details: {
      failedGates: results.filter(gate => gate.status === 'failed').map(gate => gate.name),
    },
  })
  logger.info('gates_done', {
    total: results.length,
    failed: results.filter(gate => gate.status === 'failed').length,
  })
  return results
}

async function writeFinalBlockedReports(
  config: GeneratorRunConfig,
  workspace: GeneratorWorkspace,
  audit: ToolAuditEntry[],
  gateResults: GateResult[],
  logger: GeneratorLogger,
  promoted = false
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
  const buildReview = buildDeterministicBuildReview(config, gateResults, promoted)
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
  await appendRunLog(workspace.runLogPath, {
    title: promoted ? 'Jar promoted' : 'Build blocked',
    details: { failedGates: gateResults.filter(gate => gate.status === 'failed').map(gate => gate.name) },
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
}

function buildImplementerWriteInstruction(researchSummary: string): string {
  return `Now write files. You have only write tools.
Call write_generated_java_file for each generated Java source file.
The first required call must write:
src/main/java/com/fpml/cdm/fx/mapper/generated/GeneratedFpmlToCdmMapper.java

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
  roleName: GeneratorRole
  logger: GeneratorLogger
  budgetState: LlmBudgetState
  recordStage?: boolean
  tools?: LLMTool[]
  maxToolRoundsOverride?: number
  toolCallPolicy?: ToolCallPolicy
}): Promise<RoleRun> {
  args.logger.info('role_start', { role: args.roleName })
  const startedAt = new Date()
  const auditStart = args.audit.length
  const messages = await buildRoleMessages(args)
  const roleModel = args.config.roleModels[args.roleName]
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
    executeTool: (name, input) =>
      executeGeneratorTool(
        { config: args.config, audit: args.audit, state: args.toolState, stage: args.stage },
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
  }
}

function createLlmBudgetState(config: GeneratorRunConfig): LlmBudgetState {
  const configured = config.llmBudget
  return {
    maxTotalCalls: configured?.maxTotalCalls ?? 12,
    maxInputTokensPerCall: configured?.maxInputTokensPerCall ?? 80_000,
    maxRepairAttempts: configured?.maxRepairAttempts ?? Math.min(config.maxRepairAttempts, 2),
    usedCalls: 0,
  }
}

function stageContext(role: ActiveStageContext['role'], round?: number): ActiveStageContext {
  return {
    role,
    round,
    allowedWritePaths: allowedWritesFor(role, round),
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

function previousRoundPaths(workspace: GeneratorWorkspace, round: number): string[] {
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

function hasFailures(results: GateResult[]): boolean {
  return results.some(result => result.status === 'failed')
}
