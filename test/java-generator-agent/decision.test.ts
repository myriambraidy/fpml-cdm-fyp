import { describe, expect, test } from 'bun:test'
import { isAcceptedDecision } from '../../src/java-generator-agent/decision'

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
})
