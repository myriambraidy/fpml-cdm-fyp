import { describe, expect, it } from 'bun:test'
import { policyForStatus } from '../../src/cookbook-runtime/policy'

describe('cookbook runtime policy', () => {
  it('enforces review for pilot and review-only statuses', () => {
    expect(policyForStatus('ready').forceHumanReview).toBeFalse()
    expect(policyForStatus('pilot_only').forceHumanReview).toBeTrue()
    expect(policyForStatus('review_only').autoApplyAllowed).toBeFalse()
    expect(policyForStatus('blocked').autoApplyAllowed).toBeFalse()
  })
})

