import { describe, expect, test } from 'bun:test'
import {
  buildCdmApiSelectionPass1,
  buildFinalCdmApiSelection,
  FORBIDDEN_APPROVED_CONTRACT_PACKAGE_SEGMENTS,
} from '../../src/java-generator-agent/cdm-api-selection'
import { discoverRelevantCdmApi } from '../../src/java-generator-agent/cdm-concept-resolver'
import { buildFxSingleLegDraftRecipeRequirements } from '../../src/java-generator-agent/semantic-recipes'

describe('cdm api selection', () => {
  test('uses pass1 for concepts and pass2 for recipe expansion', async () => {
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
    const final = await buildFinalCdmApiSelection({
      productFamily: 'fx-derivatives',
      implementationGroup: 'fx-single-leg',
      discovery,
      pass1Selection: pass1,
      recipeRequiredClasses: draft.requiredClasses,
      builderParameterClasses: [],
      recipeId: draft.recipeId,
    })

    expect(pass1.pass).toBe('pass1')
    expect(final.pass).toBe('pass2')
    expect(pass1.selectedClasses.some(item => item.reason === 'resolved-concept')).toBe(true)
    expect(final.selectedClasses.some(item => item.reason === 'draft-recipe-required')).toBe(true)
    expect(final.selectedClasses.length).toBeLessThan(discovery.candidateClasses.length)
    expect(
      final.selectedClasses.some(item =>
        FORBIDDEN_APPROVED_CONTRACT_PACKAGE_SEGMENTS.some(segment => item.className.includes(segment))
      )
    ).toBe(false)
  })
})
