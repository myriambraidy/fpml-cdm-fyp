import { describe, expect, test } from 'bun:test'
import type { ApprovedCdmApiContract } from '../../src/java-generator-agent/approved-cdm-api-contract'
import {
  buildContextBudgetReport,
  defaultContextBudgetConfig,
} from '../../src/java-generator-agent/context-budget'
import type { SemanticRecipeBundle } from '../../src/java-generator-agent/semantic-recipes'

describe('context budget', () => {
  test('fails oversized contracts and allows explicit override as warning', () => {
    const contract = makeContract(81)
    const recipes = makeRecipes()
    const baseConfig = defaultContextBudgetConfig({
      productFamily: 'fx-derivatives',
      implementationGroup: 'fx-single-leg',
    })

    const failed = buildContextBudgetReport({
      config: baseConfig,
      contract,
      recipes,
      finalContractMarkdown: '# Final\n',
    })
    const overridden = buildContextBudgetReport({
      config: {
        ...baseConfig,
        override: {
          enabled: true,
          reason: 'test override',
          approvedBy: 'test',
        },
      },
      contract,
      recipes,
      finalContractMarkdown: '# Final\n',
    })

    expect(failed.status).toBe('failed')
    expect(overridden.status).toBe('passed')
    expect(overridden.findings[0]?.severity).toBe('warning')
  })
})

function makeContract(classCount: number): ApprovedCdmApiContract {
  return {
    generatedAt: '2026-05-07T00:00:00.000Z',
    productFamily: 'fx-derivatives',
    implementationGroup: 'fx-single-leg',
    authority: 'compiled-jar-javap-and-semantic-recipes',
    approvedClasses: Array.from({ length: classCount }, (_, index) => ({
      className: `cdm.event.common.Test${index}`,
      reason: 'test',
      existenceAuthority: 'compiled-jar-javap',
      semanticAuthorities: ['generated-recipe'],
      allowedUsages: ['test'],
    })),
    forbiddenClasses: [],
    approvedBuilderMethods: [],
    conceptResolutions: [],
  }
}

function makeRecipes(): SemanticRecipeBundle {
  return {
    generatedAt: '2026-05-07T00:00:00.000Z',
    productFamily: 'fx-derivatives',
    implementationGroup: 'fx-single-leg',
    recipes: [],
  }
}
