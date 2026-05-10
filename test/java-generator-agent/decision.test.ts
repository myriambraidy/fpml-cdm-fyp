import { describe, expect, test } from 'bun:test'
import {
  isAcceptedDecision,
  parsePlanningDecision,
} from '../../src/java-generator-agent/decision'

describe('java generator decision parsing', () => {
  test('accepts plain accepted decision lines', () => {
    expect(isAcceptedDecision('Decision: ACCEPTED')).toBe(true)
  })

  test('accepts markdown-formatted accepted headings', () => {
    expect(isAcceptedDecision('## Decision: **ACCEPTED**')).toBe(true)
  })

  test('does not accept next-round decisions', () => {
    expect(isAcceptedDecision('## Decision: **NEXT_ROUND_REQUIRED**')).toBe(false)
  })

  test.each([
    'Decision: ACCEPTED',
    '### ACCEPTED',
    'Final Decision: **ACCEPTED**',
    '## Critique Decision: ACCEPTED',
    '### ✅ Decision: **ACCEPTED**',
  ])('parses accepted reviewer wording: %s', markdown => {
    expect(parsePlanningDecision(markdown)).toBe('accepted')
  })

  test('parses failed as terminal', () => {
    expect(parsePlanningDecision('Decision: FAILED')).toBe('failed')
  })

  test('parses next round required', () => {
    expect(parsePlanningDecision('Decision: NEXT_ROUND_REQUIRED')).toBe('next_round_required')
  })
})
