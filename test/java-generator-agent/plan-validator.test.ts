import { describe, expect, test } from 'bun:test'
import {
  DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
  renderPlanValidation,
  validatePlannerPlan,
} from '../../src/java-generator-agent/plan-validator'
import { buildProductScopeGuidance } from '../../src/java-generator-agent/product-scope'
import { requiredRosettaAreasForScope } from '../../src/java-generator-agent/rosetta-retrieval'

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

const JAVA_SHELL_BLOCK = `## Java shell contract (machine-checked)
**Generated package:** com.fpml.cdm.fx.mapper.generated
**Main generated class:** GeneratedFpmlToCdmMapper
**Required interface:** com.fpml.cdm.fx.mapper.FpmlToCdmMapper
**Generated source root:** src/main/java/com/fpml/cdm/fx/mapper/generated/
**Shell-owned files must not be rewritten:**
- pom.xml
- src/main/java/com/fpml/cdm/fx/mapper/Main.java
- src/main/java/com/fpml/cdm/fx/mapper/RuntimeArgs.java
- src/main/java/com/fpml/cdm/fx/mapper/FpmlToCdmMapper.java
`

const ROSETTA_EVIDENCE_BLOCK = `## Rosetta evidence coverage (machine-checked)
**product-root:**
- MapFxSingleLegNonTransferableProduct
**economic-terms:**
- MapFxSingleLegEconomicTerms
**settlement-payout:**
- MapFxCoreDetailsModelToSettlementPayout
**price-quantity:**
- MapFxSingleLegPriceQuantityList
**party-counterparty:**
- MapFxSingleLegCounterpartyList
- MapFxSingleLegAncillaryPartyList
**account-party-reference:**
- MapFxSingleLegAccountPartyReference
**product-identifiers-taxonomy:**
- MapProductIdentifierList
- MapProductTaxonomyList
**dates-settlement:**
- MapFxCoreDetailsModelToSettlementPayout
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

  test('runtime fixtures section accepts fixture ids with descriptions', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}
## Runtime supported fixtures (machine-checked)
- fx-ex01-fx-spot: fx-ex01-fx-spot.xml
- fx-ex02-spot-cross-w-side-rates: fx-ex02-spot-cross-w-side-rates.xml
${JAVA_SHELL_BLOCK}
${ROSETTA_EVIDENCE_BLOCK}
`,
      runtimeFixtureIds: ['fx-ex01-fx-spot', 'fx-ex02-spot-cross-w-side-rates'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
    })

    expect(result.status).toBe('passed')
    expect(result.details?.parsedRuntimeFixtureIds).toEqual([
      'fx-ex01-fx-spot',
      'fx-ex02-spot-cross-w-side-rates',
    ])
  })

  test('runtime fixtures section still rejects unknown described fixture ids', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}
## Runtime supported fixtures (machine-checked)
- fx-ex99-made-up: made-up.xml
`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
    })

    expect(result.status).toBe('failed')
    expect(result.blockingIssues.some(issue => issue.includes('unknown id'))).toBe(true)
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

  test('passes with Java shell and Rosetta evidence contracts', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}\n${RUNTIME_FIXTURES_BLOCK}\n${JAVA_SHELL_BLOCK}\n${ROSETTA_EVIDENCE_BLOCK}
## Generated files
- com.fpml.cdm.fx.mapper.generated.GeneratedFpmlToCdmMapper remains the entry class.
`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
    })

    expect(result.status).toBe('passed')
    expect(result.details?.parsedJavaShell?.generatedPackage).toBe('com.fpml.cdm.fx.mapper.generated')
    expect(result.details?.parsedRosettaAreas?.['settlement-payout']).toEqual([
      'MapFxCoreDetailsModelToSettlementPayout',
    ])
  })

  test('does not flag suffixes inside the correct generated mapper FQCN', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}\n${RUNTIME_FIXTURES_BLOCK}\n${JAVA_SHELL_BLOCK}\n${ROSETTA_EVIDENCE_BLOCK}
The implementation target is com.fpml.cdm.fx.mapper.generated.GeneratedFpmlToCdmMapper.
`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
    })

    expect(result.status).toBe('passed')
    expect(result.blockingIssues.some(issue => issue.includes('GeneratedFpmlToCdmMapper must be in package'))).toBe(false)
  })

  test('fails when scoped plan has wrong generated package', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const badShell = JAVA_SHELL_BLOCK.replace(
      'com.fpml.cdm.fx.mapper.generated',
      'org.finos.cdm.fx.singleleg'
    )
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}\n${RUNTIME_FIXTURES_BLOCK}\n${badShell}\n${ROSETTA_EVIDENCE_BLOCK}`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
    })

    expect(result.status).toBe('failed')
    expect(result.blockingIssues.some(issue => issue.includes('generated package'))).toBe(true)
  })

  test('fails when Java shell section is missing', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}\n${RUNTIME_FIXTURES_BLOCK}\n${ROSETTA_EVIDENCE_BLOCK}`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
    })

    expect(result.status).toBe('failed')
    expect(result.blockingIssues.some(issue => issue.includes('Java shell contract'))).toBe(true)
  })

  test('fails when shell-owned file is planned for rewrite', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}\n${RUNTIME_FIXTURES_BLOCK}\n${JAVA_SHELL_BLOCK}\n${ROSETTA_EVIDENCE_BLOCK}\nWe will rewrite Main.java to instantiate a different mapper.`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
    })

    expect(result.status).toBe('failed')
    expect(result.blockingIssues.some(issue => issue.includes('Main.java'))).toBe(true)
  })

  test('passes when product-identifiers-taxonomy Rosetta functions appear only under product-root (FX duplicate template)', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const rosettaWithoutTaxonomyHeading = `## Rosetta evidence coverage (machine-checked)
**product-root:**
- MapFxSingleLegNonTransferableProduct
- MapProductIdentifierList
- MapProductTaxonomyList
**economic-terms:**
- MapFxSingleLegEconomicTerms
**settlement-payout:**
- MapFxCoreDetailsModelToSettlementPayout
**price-quantity:**
- MapFxSingleLegPriceQuantityList
- MapFxCoreDetailsModelPriceListWithLocation
- MapFxCoreDetailsModelQuantityListWithLocation
**party-counterparty:**
- MapFxSingleLegCounterpartyList
- MapFxSingleLegAncillaryPartyList
**account-party-reference:**
- MapFxSingleLegAccountPartyReference
- MapPayerReceiverToAccountPartyReference
**dates-settlement:**
- MapFxCoreDetailsModelToSettlementPayout
- MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate
`
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}\n${RUNTIME_FIXTURES_BLOCK}\n${JAVA_SHELL_BLOCK}\n${rosettaWithoutTaxonomyHeading}`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
    })

    expect(result.status).toBe('passed')
    expect(result.blockingIssues.some(i => i.includes('product-identifiers-taxonomy'))).toBe(false)
  })

  test('fails when Rosetta evidence area is missing', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const incompleteRosetta = ROSETTA_EVIDENCE_BLOCK.replace(
      '**settlement-payout:**\n- MapFxCoreDetailsModelToSettlementPayout\n',
      '**settlement-payout:**\n'
    )
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}\n${RUNTIME_FIXTURES_BLOCK}\n${JAVA_SHELL_BLOCK}\n${incompleteRosetta}`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
    })

    expect(result.status).toBe('failed')
    expect(result.blockingIssues.some(issue => issue.includes('settlement-payout'))).toBe(true)
  })

  test('fails when narrative references unapproved CDM classes from Rosetta function names', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}\n${RUNTIME_FIXTURES_BLOCK}\n${JAVA_SHELL_BLOCK}\n${ROSETTA_EVIDENCE_BLOCK}
## Mapping responsibilities
- Uses get_cdm_java_class('cdm.base.staticdata.asset.common.ProductIdentifier') for product ids.
- Uses cdm.base.staticdata.asset.common.ProductTaxonomy for taxonomy mapping.
`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
    })

    expect(result.status).toBe('failed')
    expect(result.blockingIssues.some(issue => issue.includes('ProductIdentifier'))).toBe(true)
    expect(result.blockingIssues.some(issue => issue.includes('ProductTaxonomy'))).toBe(true)
  })

  test('fails when plan references CDM class outside approved contract', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}\n${RUNTIME_FIXTURES_BLOCK}\n${JAVA_SHELL_BLOCK}\n${ROSETTA_EVIDENCE_BLOCK}
## Implementation classes
- Use cdm.product.common.settlement.SettlementDate for settlement date mapping.
`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
      approvedCdmClassNames: [
        'cdm.event.common.TradeState',
        'cdm.event.common.Trade',
      ],
    })

    expect(result.status).toBe('failed')
    expect(result.blockingIssues.some(issue => issue.includes('SettlementDate'))).toBe(true)
  })

  test('allows negated references to CDM classes outside approved contract', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}\n${RUNTIME_FIXTURES_BLOCK}\n${JAVA_SHELL_BLOCK}\n${ROSETTA_EVIDENCE_BLOCK}
## Guardrails
- Do not use cdm.product.common.settlement.SettlementDate unless the contract approves it.
`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
      approvedCdmClassNames: [
        'cdm.event.common.TradeState',
        'cdm.event.common.Trade',
      ],
    })

    expect(result.blockingIssues.some(issue => issue.includes('SettlementDate'))).toBe(false)
  })

  test('does not treat project mapper interface as a CDM model class', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}\n${RUNTIME_FIXTURES_BLOCK}\n${JAVA_SHELL_BLOCK}\n${ROSETTA_EVIDENCE_BLOCK}
## Java design
- Required interface: \`com.fpml.cdm.fx.mapper.FpmlToCdmMapper\`
`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
      approvedCdmClassNames: [
        'cdm.event.common.TradeState',
        'cdm.event.common.Trade',
      ],
    })

    expect(result.blockingIssues.some(issue => issue.includes('cdm.fx.mapper.FpmlToCdmMapper'))).toBe(false)
  })

  test('allows unapproved CDM classes listed under a forbidden section', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}\n${RUNTIME_FIXTURES_BLOCK}\n${JAVA_SHELL_BLOCK}\n${ROSETTA_EVIDENCE_BLOCK}
### Forbidden classes and patterns
- cdm.base.math.PriceSchedule, cdm.base.math.PriceTypeEnum, cdm.base.staticdata.party.PartyReference
- cdm.product.common.settlement.SettlementPayout is a rejected same-simple-name candidate.

### Safe classes
- Use cdm.product.template.SettlementPayout.
`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
      approvedCdmClassNames: [
        'cdm.event.common.TradeState',
        'cdm.event.common.Trade',
        'cdm.product.template.SettlementPayout',
      ],
    })

    expect(result.blockingIssues.some(issue => issue.includes('cdm.base.math.PriceSchedule'))).toBe(false)
    expect(result.blockingIssues.some(issue => issue.includes('cdm.product.common.settlement.SettlementPayout'))).toBe(false)
  })

  test('still fails when plan positively uses an unapproved same-name CDM class', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}\n${RUNTIME_FIXTURES_BLOCK}\n${JAVA_SHELL_BLOCK}\n${ROSETTA_EVIDENCE_BLOCK}
## Key rules
- Settlement: Use cdm.product.common.settlement.SettlementPayout for payout construction.
`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
      approvedCdmClassNames: [
        'cdm.event.common.TradeState',
        'cdm.event.common.Trade',
        'cdm.product.template.SettlementPayout',
      ],
    })

    expect(result.status).toBe('failed')
    expect(result.blockingIssues.some(issue => issue.includes('cdm.product.common.settlement.SettlementPayout'))).toBe(true)
  })

  test('fails when implementation class line names unapproved CDM simple class', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}\n${RUNTIME_FIXTURES_BLOCK}\n${JAVA_SHELL_BLOCK}\n${ROSETTA_EVIDENCE_BLOCK}
## Dates
- Key classes: AdjustableOrAdjustedOrRelativeDate, SettlementDate, BusinessDayAdjustments.
`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
      approvedCdmClassNames: [
        'cdm.event.common.TradeState',
        'cdm.event.common.Trade',
      ],
    })

    expect(result.status).toBe('failed')
    expect(result.blockingIssues.some(issue => issue.includes('SettlementDate'))).toBe(true)
    expect(result.blockingIssues.some(issue => issue.includes('BusinessDayAdjustments'))).toBe(true)
  })

  test('fails when construction order builds unapproved simple CDM class', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}\n${RUNTIME_FIXTURES_BLOCK}\n${JAVA_SHELL_BLOCK}\n${ROSETTA_EVIDENCE_BLOCK}
## Construction order
1. Build PriceSchedule and NonNegativeQuantitySchedule.
`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
      approvedCdmClassNames: [
        'cdm.event.common.TradeState',
        'cdm.observable.asset.PriceSchedule',
      ],
    })

    expect(result.status).toBe('failed')
    expect(result.blockingIssues.some(issue => issue.includes('NonNegativeQuantitySchedule'))).toBe(true)
  })

  test('allows approved simple class names in construction guidance', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}\n${RUNTIME_FIXTURES_BLOCK}\n${JAVA_SHELL_BLOCK}\n${ROSETTA_EVIDENCE_BLOCK}
## Construction order
1. Build TradeState and PriceSchedule.
`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
      approvedCdmClassNames: [
        'cdm.event.common.TradeState',
        'cdm.observable.asset.PriceSchedule',
      ],
    })

    expect(result.status).toBe('passed')
  })

  test('fails when mapping responsibilities build unapproved ProductTaxonomy simple class', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}\n${RUNTIME_FIXTURES_BLOCK}\n${JAVA_SHELL_BLOCK}\n${ROSETTA_EVIDENCE_BLOCK}
| Area | Responsibility |
|------|----------------|
| product-identifiers-taxonomy | Build Identifier, AssignedIdentifier, ProductTaxonomy. |
`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
      approvedCdmClassNames: [
        'cdm.base.staticdata.identifier.AssignedIdentifier',
        'cdm.base.staticdata.identifier.Identifier',
      ],
    })

    expect(result.status).toBe('failed')
    expect(result.blockingIssues.some(issue => issue.includes('ProductTaxonomy'))).toBe(true)
  })

  test('passes when narrative forbids ObjectNode and ArrayNode for the main CDM result', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}\n${RUNTIME_FIXTURES_BLOCK}\n${JAVA_SHELL_BLOCK}\n${ROSETTA_EVIDENCE_BLOCK}
## Unsupported behavior
- No Jackson-based ObjectNode/ArrayNode used for main CDM result; only for serialization and sidecar reports.
`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
    })

    expect(result.status).toBe('passed')
    expect(result.blockingIssues.some(issue => issue.includes('Jackson tree nodes'))).toBe(false)
  })

  test('fails when narrative allows ObjectNode for the main CDM output', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}\n${RUNTIME_FIXTURES_BLOCK}\n${JAVA_SHELL_BLOCK}\n${ROSETTA_EVIDENCE_BLOCK}
## Mapping responsibilities
- Build the main CDM output with Jackson ObjectNode before serializing the response.
`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
    })

    expect(result.status).toBe('failed')
    expect(result.blockingIssues.some(issue => issue.includes('Jackson tree nodes'))).toBe(true)
  })

  test('does not flag overview prose capitalized words as unapproved CDM classes (regression)', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}\n${RUNTIME_FIXTURES_BLOCK}\n${JAVA_SHELL_BLOCK}\n${ROSETTA_EVIDENCE_BLOCK}
### Overview
Build an AI-native Java generator for FX. This run uses Rosetta mapping intent.
`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
      approvedCdmClassNames: ['cdm.event.common.TradeState'],
    })

    expect(result.status).toBe('passed')
    expect(
      result.blockingIssues.some(issue => issue.includes("not approved by this run's API contract"))
    ).toBe(false)
  })

  test('does not flag capitalized prose word At as an unapproved CDM class', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}\n${RUNTIME_FIXTURES_BLOCK}\n${JAVA_SHELL_BLOCK}\n${ROSETTA_EVIDENCE_BLOCK}
## Implementation Notes
- At runtime, serialize final TradeState at the boundary.
`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
      approvedCdmClassNames: ['cdm.event.common.TradeState'],
    })

    expect(result.blockingIssues.some(issue => issue.endsWith(': At'))).toBe(false)
  })

  test('fails tool-only planner output with targeted finding', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: '[tool calls requested]',
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
      approvedCdmClassNames: ['cdm.event.common.TradeState'],
    })

    expect(result.status).toBe('failed')
    expect(result.blockingIssues.some(issue => issue.includes('tool-only sentinel'))).toBe(true)
  })

  test('fails when narrative rejects approved TradeState.setTrade builder method', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const result = validatePlannerPlan({
      scope,
      planMarkdown: `${MACHINE_SCOPE_BLOCK}\n${RUNTIME_FIXTURES_BLOCK}\n${JAVA_SHELL_BLOCK}\n${ROSETTA_EVIDENCE_BLOCK}
The implementation will not use set-trade because it is not in the API contract.
Use TradeState.builder().trade(trade).build() instead.
`,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
    })

    expect(result.status).toBe('failed')
    expect(result.blockingIssues.some(issue => issue.includes('setTrade'))).toBe(true)
    expect(result.blockingIssues.some(issue => issue.includes('TradeState.builder().trade'))).toBe(true)
  })
})
