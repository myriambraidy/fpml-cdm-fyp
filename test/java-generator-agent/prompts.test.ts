import { describe, expect, test } from 'bun:test'
import {
  IMPLEMENTER_SYSTEM_PROMPT,
  PLANNER_SYSTEM_PROMPT,
  REPAIR_SYSTEM_PROMPT,
} from '../../src/java-generator-agent/prompts'

describe('java generator prompts', () => {
  test('planner separates runtime support from observed and future support', () => {
    expect(PLANNER_SYSTEM_PROMPT).toContain('Runtime supported in this run')
    expect(PLANNER_SYSTEM_PROMPT).toContain('Observed in evidence')
    expect(PLANNER_SYSTEM_PROMPT).toContain('Future support')
    expect(PLANNER_SYSTEM_PROMPT).toContain('## Runtime supported fixtures (machine-checked)')
  })

  test('implementer prompt rejects known malformed source patterns', () => {
    expect(IMPLEMENTER_SYSTEM_PROMPT).toContain('Write only ASCII Java source')
    expect(IMPLEMENTER_SYSTEM_PROMPT).toContain('Never use smart quotes')
    expect(IMPLEMENTER_SYSTEM_PROMPT).toContain('Never HTML-escape source code')
    expect(IMPLEMENTER_SYSTEM_PROMPT).toContain('Do not import com.fpml.cdm.fx.model.*')
  })

  test('repair prompt prioritizes earliest failed gate and runtime contract', () => {
    expect(REPAIR_SYSTEM_PROMPT).toContain('Prioritize the earliest failed gate')
    expect(REPAIR_SYSTEM_PROMPT).toContain('Preserve the runtime CLI contract')
    expect(REPAIR_SYSTEM_PROMPT).toContain('Do not introduce runtime LLM calls')
  })
})
