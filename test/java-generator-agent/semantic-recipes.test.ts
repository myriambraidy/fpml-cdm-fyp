import { describe, expect, test } from 'bun:test'
import { buildApprovedCdmApiContract } from '../../src/java-generator-agent/approved-cdm-api-contract'
import { extractBuilderParameterClasses, resolveBuilderMethodsForRecipeStep } from '../../src/java-generator-agent/cdm-builder-method-resolver'
import { buildCdmApiSelectionPass1, buildFinalCdmApiSelection } from '../../src/java-generator-agent/cdm-api-selection'
import { discoverRelevantCdmApi } from '../../src/java-generator-agent/cdm-concept-resolver'
import {
  buildFxSingleLegDraftRecipeRequirements,
  buildSemanticRecipeBundle,
} from '../../src/java-generator-agent/semantic-recipes'
import { validateSemanticRecipes } from '../../src/java-generator-agent/semantic-recipe-validator'

describe('semantic recipes', () => {
  test('core FX recipe steps have verified approved builder methods', async () => {
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
    const bundle = buildSemanticRecipeBundle({
      productFamily: 'fx-derivatives',
      implementationGroup: 'fx-single-leg',
      contract,
    })
    const recipe = bundle.recipes[0]
    const validation = validateSemanticRecipes({ recipes: bundle, contract })

    expect(validation.status).toBe('passed')
    expect(recipe.steps.every(step => !step.core || step.approvedBuilderMethods.length > 0)).toBe(true)
    expect(recipe.examples.some(example => example.fixtureKind === 'build-wiring' && example.compiles)).toBe(true)
  })
})

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
