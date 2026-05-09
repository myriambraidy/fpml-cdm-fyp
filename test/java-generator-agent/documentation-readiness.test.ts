import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import { createWorkspace } from '../../src/java-generator-agent/workspace'
import { DEFAULT_RUNTIME_FIXTURES } from '../../src/java-generator-agent/java-contract'
import type {
  GeneratorRole,
  GeneratorRunConfig,
  RoleModelConfig,
} from '../../src/java-generator-agent/types'
import {
  buildDocumentationReadinessReport,
  javaDocumentationReadinessJsonPath,
  javaDocumentationReadinessMarkdownPath,
} from '../../src/java-generator-agent/documentation-readiness'

describe('documentation readiness', () => {
  test('workspace writes passing documentation readiness artifacts', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-readiness-'))
    try {
      const config = makeConfig(root)
      const workspace = await createWorkspace(config)
      const json = JSON.parse(await Bun.file(workspace.javaDocumentationReadinessPath).text()) as {
        status: string
        rosettaAreas: Array<{ area: string; status: string }>
      }
      const markdown = await Bun.file(workspace.javaDocumentationReadinessMarkdownPath).text()

      expect(workspace.javaDocumentationReadinessPath).toBe(javaDocumentationReadinessJsonPath(config.runOutputDir))
      expect(workspace.javaDocumentationReadinessMarkdownPath).toBe(javaDocumentationReadinessMarkdownPath(config.runOutputDir))
      expect(json.status).toBe('passed')
      expect(json.rosettaAreas.some(area => area.area === 'settlement-payout' && area.status === 'resolved')).toBe(true)
      expect(markdown).toContain('Java Documentation Readiness')
      expect(markdown).toContain('Status: passed')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('readiness fails when approved API contract is missing', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-readiness-'))
    try {
      const config = makeConfig(root)
      const workspace = await createWorkspace(config)
      const report = await buildDocumentationReadinessReport({
        productFamily: config.productFamily,
        implementationGroup: 'fx-single-leg',
        runOutputDir: config.runOutputDir,
        javaShellContractPath: workspace.javaShellContractPath,
        approvedCdmApiContractPath: join(config.runOutputDir, 'agent-workspace', 'missing-contract.json'),
        approvedCdmApiContractSummaryPath: workspace.approvedCdmApiContractSummaryPath,
        semanticRecipesPath: workspace.semanticRecipesPath,
        semanticRecipesMarkdownPath: workspace.semanticRecipesMarkdownPath,
        semanticRecipeValidationPath: workspace.semanticRecipeValidationPath,
        semanticRecipeValidationMarkdownPath: workspace.semanticRecipeValidationMarkdownPath,
        semanticRecipeFixturesReportPath: workspace.semanticRecipeFixturesReportPath,
        semanticRecipeFixturesReportMarkdownPath: workspace.semanticRecipeFixturesReportMarkdownPath,
        contextBudgetReportPath: workspace.contextBudgetReportPath,
        contextBudgetReportMarkdownPath: workspace.contextBudgetReportMarkdownPath,
      })

      expect(report.status).toBe('failed')
      expect(report.blockingIssues.some(issue => issue.includes('approved-api-contract'))).toBe(true)
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
    evidenceRoots: ['data_to_learn_from/fpml/fx-derivatives'],
    fixturePaths: ['data_to_learn_from/fpml/fx-derivatives/fx-ex01-fx-spot.xml'],
    expectedCdmPaths: ['data_to_learn_from/cdm_parallel/fx-derivatives/fx-ex01-fx-spot.json'],
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
