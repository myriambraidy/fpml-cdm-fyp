import { describe, expect, test } from 'bun:test'
import type { ApprovedBuilderMethod, ApprovedCdmApiContract, ApprovedCdmClass } from '../../src/java-generator-agent/approved-cdm-api-contract'
import {
  guardCritiqueReviewerDecision,
  validateCritiqueResolutionAgainstContract,
} from '../../src/java-generator-agent/critique-resolution-guard'
import type { PlanValidationResult } from '../../src/java-generator-agent/plan-validator'

describe('critique resolution guard', () => {
  test('detects reviewer contradiction for approved SettlementPayout', () => {
    const result = validateCritiqueResolutionAgainstContract({
      resolutionMarkdown: 'cdm.product.template.SettlementPayout is not found in the jar.',
      contract: fixtureContract({
        approvedClasses: ['cdm.product.template.SettlementPayout'],
        approvedBuilderMethods: [],
      }),
    })

    expect(result.status).toBe('failed')
    expect(result.findings).toContain(
      'Critique resolution contradicts approved contract by claiming approved class is missing: cdm.product.template.SettlementPayout'
    )
  })

  test('detects reviewer contradiction for approved builder method', () => {
    const result = validateCritiqueResolutionAgainstContract({
      resolutionMarkdown: 'cdm.product.template.SettlementPayout has no setPriceQuantity builder method.',
      contract: fixtureContract({
        approvedClasses: ['cdm.product.template.SettlementPayout'],
        approvedBuilderMethods: [
          fixtureBuilderMethod({
            className: 'cdm.product.template.SettlementPayout',
            methodName: 'setPriceQuantity',
            rawSignature: 'public abstract cdm.product.template.SettlementPayout$SettlementPayoutBuilder setPriceQuantity(cdm.product.common.settlement.ResolvablePriceQuantity)',
          }),
        ],
      }),
    })

    expect(result.status).toBe('failed')
    expect(result.findings).toContain(
      'Critique resolution contradicts approved builder method: cdm.product.template.SettlementPayout.setPriceQuantity'
    )
  })

  test('guards final failed decision when validation passed and reviewer contradicts contract', () => {
    const result = guardCritiqueReviewerDecision({
      decision: 'failed',
      resolution: 'Decision: FAILED\n\ncdm.product.template.SettlementPayout is missing.',
      validationResult: passedValidation(),
      contract: fixtureContract({
        approvedClasses: ['cdm.product.template.SettlementPayout'],
        approvedBuilderMethods: [],
      }),
      finalRound: true,
    })

    expect(result.decision).toBe('accepted')
    expect(result.resolution).toContain('## Deterministic Critique Guard')
    expect(result.resolution).toContain('Decision: ACCEPTED')
    expect(result.resolution.indexOf('Decision: ACCEPTED')).toBeLessThan(result.resolution.indexOf('Decision: FAILED'))
  })

  test('does not guard failed decision when plan validation failed', () => {
    const result = guardCritiqueReviewerDecision({
      decision: 'failed',
      resolution: 'Decision: FAILED\n\ncdm.product.template.SettlementPayout is missing.',
      validationResult: failedValidation(),
      contract: fixtureContract({
        approvedClasses: ['cdm.product.template.SettlementPayout'],
        approvedBuilderMethods: [],
      }),
      finalRound: true,
    })

    expect(result.decision).toBe('failed')
    expect(result.resolution).not.toContain('Deterministic Critique Guard')
  })
})

function fixtureContract(args: {
  approvedClasses: string[]
  approvedBuilderMethods: ApprovedBuilderMethod[]
}): ApprovedCdmApiContract {
  return {
    generatedAt: '2026-05-10T00:00:00.000Z',
    productFamily: 'fx-derivatives',
    implementationGroup: 'fx-single-leg',
    authority: 'compiled-jar-javap-and-semantic-recipes',
    approvedClasses: args.approvedClasses.map(fixtureClass),
    forbiddenClasses: [],
    approvedBuilderMethods: args.approvedBuilderMethods,
    conceptResolutions: [],
  }
}

function fixtureClass(className: string): ApprovedCdmClass {
  return {
    className,
    reason: 'test',
    existenceAuthority: 'compiled-jar-javap',
    semanticAuthorities: ['generated-recipe'],
    allowedUsages: ['test'],
  }
}

function fixtureBuilderMethod(args: {
  className: string
  methodName: string
  rawSignature: string
}): ApprovedBuilderMethod {
  return {
    className: args.className,
    methodName: args.methodName,
    parameterTypes: ['cdm.product.common.settlement.ResolvablePriceQuantity'],
    returnType: 'cdm.product.template.SettlementPayout$SettlementPayoutBuilder',
    rawSignature: args.rawSignature,
    intent: 'set-price-quantity',
    source: 'compiled-jar-javap',
    reason: 'test',
  }
}

function passedValidation(): PlanValidationResult {
  return {
    status: 'passed',
    blockingIssues: [],
    warnings: [],
  }
}

function failedValidation(): PlanValidationResult {
  return {
    status: 'failed',
    blockingIssues: ['failed'],
    warnings: [],
  }
}
