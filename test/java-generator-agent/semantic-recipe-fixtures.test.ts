import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import { buildApprovedCdmApiContract } from '../../src/java-generator-agent/approved-cdm-api-contract'
import { extractBuilderParameterClasses, resolveBuilderMethodsForRecipeStep } from '../../src/java-generator-agent/cdm-builder-method-resolver'
import { buildCdmApiSelectionPass1, buildFinalCdmApiSelection } from '../../src/java-generator-agent/cdm-api-selection'
import { discoverRelevantCdmApi } from '../../src/java-generator-agent/cdm-concept-resolver'
import { writeSemanticRecipeFixtures } from '../../src/java-generator-agent/semantic-recipe-fixtures'
import {
  buildFxSingleLegDraftRecipeRequirements,
  buildSemanticRecipeBundle,
} from '../../src/java-generator-agent/semantic-recipes'

describe('semantic recipe fixtures', () => {
  test('writes build-wiring and recipe-derived fixtures', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-fixtures-'))
    try {
      const bundle = await buildBundle()
      const report = await writeSemanticRecipeFixtures({
        runOutputDir: root,
        recipes: bundle,
        jsonPath: join(root, 'agent-workspace', 'semantic-recipe-fixtures.json'),
        markdownPath: join(root, 'agent-workspace', 'semantic-recipe-fixtures.md'),
      })

      expect(report.status).toBe('passed')
      expect(report.fixtures.some(fixture => fixture.fixtureKind === 'build-wiring')).toBe(true)
      expect(report.fixtures.some(fixture => fixture.fixtureKind === 'recipe-derived' && fixture.methodCount > 0)).toBe(true)
      expect(await Bun.file(report.fixtures[0]?.path ?? '').exists()).toBe(true)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})

async function buildBundle() {
  const discovery = await discoverRelevantCdmApi({
    productFamily: 'fx-derivatives',
    implementationGroup: 'fx-single-leg',
  })
  const pass1 = await buildCdmApiSelectionPass1({
    productFamily: 'fx-derivatives',
    implementationGroup: 'fx-single-leg',
    discovery,
  })
  const draft = buildFxSingleLegDraftRecipeRequirements(pass1)
  const draftMethods = await resolveMethods(draft.steps)
  const final = await buildFinalCdmApiSelection({
    productFamily: 'fx-derivatives',
    implementationGroup: 'fx-single-leg',
    discovery,
    pass1Selection: pass1,
    recipeRequiredClasses: draft.requiredClasses,
    builderParameterClasses: extractBuilderParameterClasses(draftMethods),
    recipeId: draft.recipeId,
  })
  const finalRequirements = buildFxSingleLegDraftRecipeRequirements(final)
  const finalMethods = await resolveMethods(finalRequirements.steps)
  const contract = await buildApprovedCdmApiContract({
    productFamily: 'fx-derivatives',
    implementationGroup: 'fx-single-leg',
    discovery,
    selection: final,
    approvedBuilderMethods: finalMethods,
  })
  return buildSemanticRecipeBundle({
    productFamily: 'fx-derivatives',
    implementationGroup: 'fx-single-leg',
    contract,
  })
}

async function resolveMethods(
  steps: ReturnType<typeof buildFxSingleLegDraftRecipeRequirements>['steps']
) {
  const methods = await Promise.all(
    steps.map(step =>
      resolveBuilderMethodsForRecipeStep({
        classNames: step.classNames,
        intents: step.requiredBuilderIntents,
      })
    )
  )
  return methods.flat()
}
