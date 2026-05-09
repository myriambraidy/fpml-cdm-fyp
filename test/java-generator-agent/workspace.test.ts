import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import { createWorkspace } from '../../src/java-generator-agent'
import { DEFAULT_RUNTIME_FIXTURES } from '../../src/java-generator-agent/java-contract'
import {
  buildRoleMessages,
  IMPLEMENTER_SYSTEM_PROMPT,
  PLANNER_SYSTEM_PROMPT,
} from '../../src/java-generator-agent/prompts'
import type {
  GeneratorRole,
  GeneratorRunConfig,
  RoleModelConfig,
} from '../../src/java-generator-agent/types'

describe('java generator workspace', () => {
  test('creates markdown workspace files for an FX derivatives run', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-workspace-'))
    try {
      const config = makeConfig(root)
      const workspace = await createWorkspace(config)

      const productScope = await Bun.file(workspace.productScopePath).text()
      const evidencePacket = await Bun.file(workspace.evidencePacketPath).text()
      const apiSummary = await Bun.file(workspace.cdmJavaApiSummaryPath).text()
      const missingClasses = await Bun.file(workspace.cdmJavaMissingClassesPath).text()
      const relevantApi = await Bun.file(workspace.relevantCdmApiCandidatesMarkdownPath).text()
      const pass1Selection = await Bun.file(workspace.cdmApiSelectionPass1MarkdownPath).text()
      const finalSelection = await Bun.file(workspace.cdmApiSelectionFinalMarkdownPath).text()
      const approvedContract = await Bun.file(workspace.approvedCdmApiContractMarkdownPath).text()
      const approvedContractSummary = await Bun.file(workspace.approvedCdmApiContractSummaryPath).text()
      const draftRecipes = await Bun.file(workspace.semanticRecipesDraftMarkdownPath).text()
      const semanticRecipes = await Bun.file(workspace.semanticRecipesMarkdownPath).text()
      const recipeValidation = await Bun.file(workspace.semanticRecipeValidationMarkdownPath).text()
      const contextBudget = await Bun.file(workspace.contextBudgetReportMarkdownPath).text()
      const finalContract = await Bun.file(workspace.finalImplementationContractPath).text()
      const runLog = await Bun.file(workspace.runLogPath).text()

      expect(productScope).toContain('Selected product family: fx-derivatives')
      expect(productScope).toContain('data_to_learn_from')
      expect(productScope).toContain('Default current implementation group: fx-single-leg')
      expect(productScope).toContain('Do not add non-FX products')
      expect(evidencePacket).toContain('Evidence Packet')
      expect(apiSummary).toContain('CDM Java API Summary')
      expect(missingClasses).toContain('Missing-Class Observations')
      expect(relevantApi).toContain('Relevant CDM API Candidates')
      expect(pass1Selection).toContain('Pass: pass1')
      expect(finalSelection).toContain('Pass: pass2')
      expect(approvedContract).toContain('Approved CDM API Contract')
      expect(approvedContract).toContain('cdm.event.common.TradeState')
      expect(approvedContractSummary).toContain('Approved CDM API Contract Summary')
      expect(approvedContractSummary).toContain('cdm.event.common.TradeState')
      expect(approvedContractSummary.length).toBeLessThan(approvedContract.length)
      expect(draftRecipes).toContain('Draft Semantic Recipe Requirements')
      expect(semanticRecipes).toContain('Semantic Construction Recipes')
      expect(semanticRecipes).toContain('Build FX single-leg TradeState')
      expect(recipeValidation).toContain('Status: passed')
      expect(contextBudget).toContain('Status: passed')
      expect(finalContract).toContain('Final Implementation Contract')
      expect(finalContract).toContain('approved-cdm-api-contract')
      expect(finalContract).toContain('Never write Java import aliases')
      expect(runLog).toContain('Workspace created')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('planner context uses compact contract authorities instead of full API pack', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-workspace-'))
    try {
      const config = makeConfig(root)
      const workspace = await createWorkspace(config)
      const messages = await buildRoleMessages({
        systemPrompt: PLANNER_SYSTEM_PROMPT,
        config,
        workspace,
        userInstruction: 'Plan.',
        roleName: 'planner',
      })
      const userMessage = messages.find(message => message.role === 'user')

      expect(userMessage?.content).toContain(workspace.cdmJavaApiSummaryPath)
      expect(userMessage?.content).toContain(workspace.javaShellContractPath)
      expect(userMessage?.content).toContain(workspace.javaDocumentationReadinessMarkdownPath)
      expect(userMessage?.content).toContain(workspace.approvedCdmApiContractSummaryPath)
      expect(userMessage?.content).toContain(workspace.semanticRecipesMarkdownPath)
      expect(userMessage?.content).toContain(workspace.semanticRecipeValidationMarkdownPath)
      expect(userMessage?.content).toContain(workspace.contextBudgetReportMarkdownPath)
      expect(userMessage?.content).not.toContain(workspace.cdmJavaMissingClassesPath)
      expect(userMessage?.content).not.toContain(workspace.relevantCdmApiCandidatesMarkdownPath)
      expect(userMessage?.content).not.toContain(workspace.cdmApiSelectionFinalMarkdownPath)
      expect(userMessage?.content).not.toContain(workspace.approvedCdmApiContractMarkdownPath)
      expect(userMessage?.content).not.toContain(workspace.cdmJavaApiPackPath)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('implementer context uses the final contract instead of stale plan artifacts', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-workspace-'))
    try {
      const config = makeConfig(root)
      const workspace = await createWorkspace(config)
      const messages = await buildRoleMessages({
        systemPrompt: IMPLEMENTER_SYSTEM_PROMPT,
        config,
        workspace,
        userInstruction: 'Implement.',
        roleName: 'implementer',
      })
      const userMessage = messages.find(message => message.role === 'user')

      expect(userMessage?.content).toContain(workspace.finalImplementationContractPath)
      expect(userMessage?.content).toContain(workspace.approvedCdmApiContractSummaryPath)
      expect(userMessage?.content).not.toContain(workspace.approvedCdmApiContractMarkdownPath)
      expect(userMessage?.content).toContain(workspace.semanticRecipesMarkdownPath)
      expect(userMessage?.content).not.toContain(workspace.acceptedPlanPath)
      expect(userMessage?.content).not.toContain('critique-resolution')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})

function makeConfig(root: string): GeneratorRunConfig {
  return {
    runId: 'test-run',
    productFamily: 'fx-derivatives',
    supportedProducts: [],
    baseOutputDir: root,
    runOutputDir: join(root, 'runs', 'test-run'),
    maxPlanningRounds: 3,
    maxRepairAttempts: 3,
    requireApproval: false,
    resume: false,
    evidenceRoots: [
      'data/agent-cookbook/latest',
      'data/rosetta-source/latest',
      'data_to_learn_from/fpml/fx-derivatives',
      'data_to_learn_from/cdm_parallel/fx-derivatives',
    ],
    fixturePaths: [
      'data_to_learn_from/fpml/fx-derivatives/fx-ex01-fx-spot.xml',
      'data_to_learn_from/fpml/fx-derivatives/fx-ex03-fx-fwd.xml',
    ],
    expectedCdmPaths: [
      'data_to_learn_from/cdm_parallel/fx-derivatives/fx-ex01-fx-spot.json',
      'data_to_learn_from/cdm_parallel/fx-derivatives/fx-ex03-fx-fwd.json',
    ],
    runtimeFixtures: DEFAULT_RUNTIME_FIXTURES,
    roleModels: makeRoleModels(),
  }
}

function makeRoleModels(): Record<GeneratorRole, RoleModelConfig> {
  return {
    planner: { model: 'qwen/qwen3-coder-30b-a3b-instruct', maxTokens: 9000, maxToolRounds: 3 },
    critic: { model: 'qwen/qwen3-coder-next', maxTokens: 5000, maxToolRounds: 3 },
    'critique-reviewer': { model: 'qwen/qwen3-coder-next', maxTokens: 5000, maxToolRounds: 2 },
    implementer: { model: 'minimax/minimax-m2.7', maxTokens: 16_000, maxToolRounds: 6 },
    repair: { model: 'minimax/minimax-m2.7', maxTokens: 12_000, maxToolRounds: 6 },
    'build-reviewer': { model: 'qwen/qwen3-coder-next', maxTokens: 4000, maxToolRounds: 2 },
  }
}
