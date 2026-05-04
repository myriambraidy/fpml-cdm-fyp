import { describe, expect, test } from 'bun:test'
import {
  renderPlanValidation,
  validatePlannerPlan,
} from '../../src/java-generator-agent/plan-validator'
import { buildProductScopeGuidance } from '../../src/java-generator-agent/product-scope'

const MACHINE_SCOPE_BLOCK = `## Implementation scope (machine-checked)

**Product family:** fx-derivatives

**In scope (implementation groups):**
- fx-single-leg

**Explicitly out of scope (implementation groups):**
- fx-swap
- fx-simple-option
`

const RUNTIME_FIXTURES_BLOCK = `## Runtime supported fixtures (machine-checked)
- fx-ex01-fx-spot
`

describe('java generator plan validator', () => {
  test('rejects known absent cookbook paths and runtime LLM dependency', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}\nUse data/agent-cookbook/latest/fx-derivatives and add a runtime LLM fallback for mapping.`,
    })

    expect(result.status).toBe('failed')
    expect(result.blockingIssues.length).toBeGreaterThanOrEqual(2)
    expect(renderPlanValidation(result)).toContain('Status: failed')
  })

  test('passes when machine-checked scope lists only fx-single-leg and prose mentions other fx tokens', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}
Plan currentImplementationGroup fx-single-leg first. Candidate next groups are fx-swap and fx-simple-option.
We map fixtures under data_to_learn_from/fpml/fx-derivatives including fx-ex03-fx-fwd.xml (forward single-leg).
The shipped mapper is deterministic and has no AI call.`,
    })

    expect(result.status).toBe('passed')
    expect(result.details?.parsedInScopeGroups).toEqual(['fx-single-leg'])
  })

  test('passes when the plan explicitly forbids runtime LLM use', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}
${RUNTIME_FIXTURES_BLOCK}
## Validation gates
- No LLM dependency: Generated code must contain zero external dependencies on AI models or runtime LLMs.
- Runtime execution of the generated Java mapper must not invoke or depend on any external AI/LLM service or model.`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
    })

    expect(result.status).toBe('passed')
  })

  test('fails when in-scope lists an undefined slug such as fx-fwd', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const badBlock = `## Implementation scope (machine-checked)

**Product family:** fx-derivatives

**In scope (implementation groups):**
- fx-fwd

**Explicitly out of scope (implementation groups):**
- fx-swap
`
    const result = validatePlannerPlan({ scope, planMarkdown: badBlock })

    expect(result.status).toBe('failed')
    expect(result.blockingIssues.some(i => i.includes('fx-fwd'))).toBe(true)
  })

  test('fails when required implementation scope section is missing', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: 'Plan for fx-single-leg only. No machine-checked header.',
    })

    expect(result.status).toBe('failed')
    expect(result.blockingIssues.some(i => i.includes('Implementation scope (machine-checked)'))).toBe(true)
  })

  test('fails when in-scope omits currentImplementationGroup', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const onlySwap = `## Implementation scope (machine-checked)

**Product family:** fx-derivatives

**In scope (implementation groups):**
- fx-swap

**Explicitly out of scope (implementation groups):**
- fx-single-leg
`
    const result = validatePlannerPlan({ scope, planMarkdown: onlySwap })

    expect(result.status).toBe('failed')
    expect(
      result.blockingIssues.some(i => i.includes('currentImplementationGroup'))
    ).toBe(true)
  })

  test('warns when a group is both in scope and out of scope', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const overlap = `## Implementation scope (machine-checked)

**Product family:** fx-derivatives

**In scope (implementation groups):**
- fx-single-leg

**Explicitly out of scope (implementation groups):**
- fx-single-leg
- fx-swap
`
    const result = validatePlannerPlan({ scope, planMarkdown: overlap })

    expect(result.status).toBe('passed')
    expect(result.warnings.some(w => w.includes('fx-single-leg'))).toBe(true)
  })

  test('renderPlanValidation includes validation details when details present', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({ scope, planMarkdown: MACHINE_SCOPE_BLOCK })
    const md = renderPlanValidation(result)
    expect(md).toContain('## Validation details')
    expect(md).toContain('structured-section')
  })

  test('runtime fixtures section passes when ids match config', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}\n${RUNTIME_FIXTURES_BLOCK}`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
    })
    expect(result.status).toBe('passed')
    expect(result.details?.parsedRuntimeFixtureIds).toEqual(['fx-ex01-fx-spot'])
  })

  test('runtime fixtures section fails when heading missing', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: MACHINE_SCOPE_BLOCK,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
    })
    expect(result.status).toBe('failed')
    expect(result.blockingIssues.some(i => i.includes('Runtime supported fixtures'))).toBe(true)
  })

  test('runtime fixtures section fails on unknown id', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const bad = `${MACHINE_SCOPE_BLOCK}
## Runtime supported fixtures (machine-checked)
- fx-ex99-unknown
`
    const result = validatePlannerPlan({
      scope,
      planMarkdown: bad,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
    })
    expect(result.status).toBe('failed')
    expect(result.blockingIssues.some(i => i.includes('unknown id'))).toBe(true)
  })

  test('runtime fixtures section fails when config id missing from plan', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const emptyRuntime = `${MACHINE_SCOPE_BLOCK}
## Runtime supported fixtures (machine-checked)

`
    const result = validatePlannerPlan({
      scope,
      planMarkdown: emptyRuntime,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
    })
    expect(result.status).toBe('failed')
    expect(result.blockingIssues.some(i => i.includes('missing'))).toBe(true)
  })
})
