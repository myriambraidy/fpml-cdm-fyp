import type { CookbookOperationalStatus } from './types'

export interface CookbookPolicyDecision {
  allowedForGuidance: boolean
  autoApplyAllowed: boolean
  forceHumanReview: boolean
}

export function policyForStatus(status: CookbookOperationalStatus): CookbookPolicyDecision {
  if (status === 'ready') {
    return {
      allowedForGuidance: true,
      autoApplyAllowed: true,
      forceHumanReview: false,
    }
  }
  if (status === 'pilot_only') {
    return {
      allowedForGuidance: true,
      autoApplyAllowed: true,
      forceHumanReview: true,
    }
  }
  return {
    allowedForGuidance: true,
    autoApplyAllowed: false,
    forceHumanReview: true,
  }
}

