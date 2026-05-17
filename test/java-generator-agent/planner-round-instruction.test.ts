import { describe, expect, test } from 'bun:test'
import { buildPlannerRoundInstruction } from '../../src/java-generator-agent/planner-round-instruction'

describe('planner round instruction', () => {
  test('first round asks for the initial plan', () => {
    expect(buildPlannerRoundInstruction(1)).toContain('Write the first planner-plan.md')
  })

  test('revised rounds require removing previous blocking issues', () => {
    const instruction = buildPlannerRoundInstruction(2)

    expect(instruction).toContain('Remove every previous blocking issue exactly')
    expect(instruction).toContain('Do not repeat a class, enum constant, fixture formatting error, or missing section')
    expect(instruction).toContain('Runtime fixture bullets must contain exact runtime fixture ids')
  })
})
