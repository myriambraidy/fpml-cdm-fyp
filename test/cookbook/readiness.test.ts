import { describe, expect, it } from 'bun:test'
import { computeFamilyReadiness } from '../../src/cookbook/readiness'
import { makeLoadedFamily } from './helpers'

describe('computeFamilyReadiness', () => {
  it('marks strong clean folders ready', () => {
    const result = computeFamilyReadiness(makeLoadedFamily())

    expect(result.operationalStatus).toBe('ready')
  })

  it('marks good folders pilot-only', () => {
    const result = computeFamilyReadiness(
      makeLoadedFamily({
        qualityRating: 'good',
      })
    )

    expect(result.operationalStatus).toBe('pilot_only')
  })

  it('marks integrity failures review-only', () => {
    const result = computeFamilyReadiness(
      makeLoadedFamily({
        integrityOk: false,
        publicationFinal: false,
      })
    )

    expect(result.operationalStatus).toBe('review_only')
  })

  it('marks zero semantic folders blocked', () => {
    const result = computeFamilyReadiness(
      makeLoadedFamily({
        semanticPairs: 0,
      })
    )

    expect(result.operationalStatus).toBe('blocked')
  })
})
