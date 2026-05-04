import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import type { LLMClient } from '../agent/types'
import type { GeneratorRole } from './types'
import { synthesizeAcceptedPlan } from './accepted-plan'
import { isAcceptedDecision } from './decision'
import { runGates } from './gates'
import { createJavaProjectShell } from './java-shell'
import type { GeneratorLogger } from './logger'
import { createConsoleGeneratorLogger } from './logger'
import { appendRunLog } from './run-log'
import {
  BUILD_REVIEWER_SYSTEM_PROMPT,
  CRITIC_SYSTEM_PROMPT,
  CRITIQUE_REVIEWER_SYSTEM_PROMPT,
  IMPLEMENTER_SYSTEM_PROMPT,
  PLANNER_SYSTEM_PROMPT,
  REPAIR_SYSTEM_PROMPT,
  buildRoleMessages,
} from './prompts'
import { renderGateFailureClassification } from './gate-classification'
import { promoteGeneratedJar } from './promotion'
import { writeFinalBuildReport, writeToolAuditLog } from './reports'
import { renderPlanValidation, validatePlannerPlan } from './plan-validator'
import type { ProductScopeGuidance } from './product-scope'
import { writeRoundSummary } from './round-summary'
import {
  appendCostLedgerEntry,
  appendStageManifestEntry,
  createStageEntry,
  stageArtifactExists,
} from './stage-tracking'
import { callRoleWithTools } from './tool-runner'
import { createToolExecutionState, executeGeneratorTool, GENERATOR_LLM_TOOLS } from './tools'
import { createWorkspace } from './workspace'
import type {
  ActiveStageContext,
  GateResult,
  GeneratorRunConfig,
  GeneratorWorkspace,
  ToolAuditEntry,
  ToolExecutionState,
} from './types'

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
    const accepted = await runPlanningLoop(args.llm, args.config, workspace, audit, toolState, logger)
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

    await runImplementer(args.llm, args.config, workspace, audit, toolState, logger)
    let gateResults = await runAndLogGates(args.config, workspace, logger)

    for (
      let attempt = 1;
      hasFailures(gateResults) && attempt <= args.config.maxRepairAttempts;
      attempt += 1
    ) {
      await runRepair(args.llm, args.config, workspace, audit, toolState, gateResults, attempt, logger)
      gateResults = await runAndLogGates(args.config, workspace, logger)
    }

    const promoted = await promoteGeneratedJar(args.config, gateResults)
    const buildReview = await runBuildReviewer(
      args.llm,
      args.config,
      workspace,
      audit,
      toolState,
      gateResults,
      logger
    )
    await writeFinalBuildReport({
      config: args.config,
      gateResults,
      promoted,
      markdown: buildReview,
    })
    await writeToolAuditLog(args.config, audit)

    await appendRunLog(workspace.runLogPath, {
      title: promoted ? 'Jar promoted' : 'Build blocked',
      details: { failedGates: gateResults.filter(gate => gate.status === 'failed').map(gate => gate.name) },
    })
    logger.info('run_done', { promoted })
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
  logger: GeneratorLogger
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
      if (isAcceptedDecision(resolution) && /Status:\s*passed/iu.test(validationMarkdown)) {
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

    const planner = await runRole({
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
    })
    await writeFile(plannerPath, planner, 'utf8')
    logger.info('role_artifact_written', { role: 'planner', round })

    const validation = validatePlannerPlan({
      planMarkdown: planner,
      scope: productScope,
      runtimeFixtureIds: config.runtimeFixtures.map(fixture => fixture.id),
    })
    await writeFile(validationPath, renderPlanValidation(validation), 'utf8')
    await writeFile(
      join(roundDir, 'plan-validation.json'),
      JSON.stringify(validation, null, 2),
      'utf8'
    )

    const critic = await runRole({
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
    })
    await writeFile(criticPath, critic, 'utf8')
    logger.info('role_artifact_written', { role: 'critic', round })

    const resolution = await runRole({
      llm,
      config,
      workspace,
      audit,
      toolState,
      stage: stageContext('critique-reviewer', round),
      systemPrompt: CRITIQUE_REVIEWER_SYSTEM_PROMPT,
      userInstruction: 'Resolve the critic review and decide whether this planning round is accepted.',
      extraPaths: [plannerPath, criticPath],
      roleName: 'critique-reviewer',
      logger,
    })
    await writeFile(resolutionPath, resolution, 'utf8')
    logger.info('role_artifact_written', { role: 'critique-reviewer', round })

    const summaryPath = join(roundDir, 'round-summary.md')
    await writeRoundSummary({ round, plannerPath, criticPath, resolutionPath, outputPath: summaryPath })

    if (isAcceptedDecision(resolution) && validation.status === 'passed') {
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
  logger: GeneratorLogger
): Promise<void> {
  await appendRunLog(workspace.runLogPath, { title: 'Implementer started' })
  logger.info('implementer_start')
  const markdown = await runRole({
    llm,
    config,
    workspace,
    audit,
    toolState,
    stage: stageContext('implementer'),
    systemPrompt: IMPLEMENTER_SYSTEM_PROMPT,
    userInstruction:
      'Generate the Java Maven project now. Use write_generated_java for every generated Java class under com.fpml.cdm.fx.mapper.generated. Use write_file only for other allowed paths (tests, fixtures, reports, agent-workspace logs). End with a concise implementation summary.',
    extraPaths: [workspace.acceptedPlanPath],
    roleName: 'implementer',
    logger,
  })
  await writeFile(workspace.implementationLogPath, markdown, 'utf8')
  await appendRunLog(workspace.runLogPath, { title: 'Implementer completed' })
  logger.info('implementer_done')
}

async function runRepair(
  llm: LLMClient,
  config: GeneratorRunConfig,
  workspace: GeneratorWorkspace,
  audit: ToolAuditEntry[],
  toolState: ToolExecutionState,
  gateResults: GateResult[],
  attempt: number,
  logger: GeneratorLogger
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
  logger.warn('repair_start', { attempt })
  const markdown = await runRole({
    llm,
    config,
    workspace,
    audit,
    toolState,
    stage: stageContext('repair'),
    systemPrompt: REPAIR_SYSTEM_PROMPT,
    userInstruction: `Repair failed gates for attempt ${attempt}. Prioritize the earliest failed gate category in failure-classification-attempt-${attempt}.md. Use write_generated_java for generated Java classes.`,
    extraPaths: [
      workspace.acceptedPlanPath,
      workspace.implementationLogPath,
      join(config.runOutputDir, 'build-reports', `failed-gates-attempt-${attempt}.json`),
      join(config.runOutputDir, 'build-reports', `failure-classification-attempt-${attempt}.md`),
    ],
    roleName: 'repair',
    logger,
  })
  await writeFile(workspace.repairLogPath, `${markdown}\n`, 'utf8')
  logger.info('repair_done', { attempt })
}

async function runBuildReviewer(
  llm: LLMClient,
  config: GeneratorRunConfig,
  workspace: GeneratorWorkspace,
  audit: ToolAuditEntry[],
  toolState: ToolExecutionState,
  gateResults: GateResult[],
  logger: GeneratorLogger
): Promise<string> {
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
  return runRole({
    llm,
    config,
    workspace,
    audit,
    toolState,
    stage: stageContext('build-reviewer'),
    systemPrompt: BUILD_REVIEWER_SYSTEM_PROMPT,
    userInstruction: 'Write the final build report.',
    extraPaths: [
      join(config.runOutputDir, 'build-reports', 'final-gates.json'),
      join(config.runOutputDir, 'build-reports', 'failure-classification.md'),
    ],
    roleName: 'build-reviewer',
    logger,
  })
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
}): Promise<string> {
  args.logger.info('role_start', { role: args.roleName })
  const startedAt = new Date()
  const auditStart = args.audit.length
  const messages = await buildRoleMessages(args)
  const roleModel = args.config.roleModels[args.roleName]
  const output = await callRoleWithTools({
    llm: args.llm,
    messages,
    tools: GENERATOR_LLM_TOOLS,
    model: roleModel.model,
    fallbackModel: roleModel.fallbackModel,
    maxTokens: roleModel.maxTokens,
    maxToolRounds: roleModel.maxToolRounds,
    logger: args.logger,
    roleName: args.roleName,
    executeTool: (name, input) =>
      executeGeneratorTool(
        { config: args.config, audit: args.audit, state: args.toolState, stage: args.stage },
        name,
        input
      ),
  })
  const endedAt = new Date()
  const auditSlice = args.audit.slice(auditStart)
  const failedToolCalls = auditSlice.filter(entry => entry.ok === false).length
  const cachedToolCalls = auditSlice.filter(entry => entry.cacheStatus === 'hit').length
  await appendStageManifestEntry(
    args.config,
    createStageEntry({
      stage: args.roleName,
      round: args.stage.round,
      status: 'passed',
      model: roleModel.model,
      startedAt: startedAt.toISOString(),
      endedAt: endedAt.toISOString(),
      toolCalls: auditSlice.length,
      failedToolCalls,
      message: `outputChars=${output.length}`,
    })
  )
  await appendCostLedgerEntry(args.config, {
    role: args.roleName,
    round: args.stage.round,
    model: roleModel.model,
    inputChars: messages.reduce((total, message) => total + message.content.length, 0),
    outputChars: output.length,
    llmCalls: 1,
    toolCalls: auditSlice.length,
    cachedToolCalls,
    failedToolCalls,
    durationMs: endedAt.getTime() - startedAt.getTime(),
  })
  args.logger.info('role_done', { role: args.roleName, outputChars: output.length })
  return output
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
