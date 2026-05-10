import type { GateAuthority, GateResult } from './types'

export type GatePolicy = {
  name: string
  authority: GateAuthority
  blocksDownstream: boolean
  feedsRepair: boolean
}

const diagnosticGates = new Set([
  'source-hygiene',
  'generated-java-static-sanity',
  'java-reference-check',
  'cdm-java-api-usage',
  'cdm-java-member-usage',
  'rosetta-java-usage',
  'generated-test-shell-contract',
  'builder-readiness-usage',
  'generated-report-consistency',
  'generated-doc-hygiene',
])

const authoritativeGates = new Set([
  'typescript-typecheck',
  'cdm-rosetta-preflight',
  'maven-dependency-preflight',
  'maven-compile',
  'maven-test-compile',
  'maven-test',
  'maven-package',
  'output-validation',
])

const pipelineIntegrityGates = new Set([
  'generated-project-structure',
  'generated-shell-contract',
  'generated-implementation-contract',
  'implementation-artifacts',
])

export function policyForGateName(name: string): GatePolicy {
  if (name.startsWith('jar-runtime:') || name.startsWith('rosetta-validation:')) {
    return {
      name,
      authority: 'authoritative',
      blocksDownstream: true,
      feedsRepair: true,
    }
  }
  if (diagnosticGates.has(name)) {
    return {
      name,
      authority: 'diagnostic',
      blocksDownstream: false,
      feedsRepair: true,
    }
  }
  if (pipelineIntegrityGates.has(name)) {
    return {
      name,
      authority: 'pipeline_integrity',
      blocksDownstream: true,
      feedsRepair: true,
    }
  }
  if (authoritativeGates.has(name)) {
    return {
      name,
      authority: 'authoritative',
      blocksDownstream: true,
      feedsRepair: true,
    }
  }
  return {
    name,
    authority: 'authoritative',
    blocksDownstream: true,
    feedsRepair: true,
  }
}

export function annotateGateResult(result: GateResult): GateResult {
  return {
    ...result,
    authority: result.authority ?? policyForGateName(result.name).authority,
  }
}

export function gateBlocksDownstream(result: GateResult): boolean {
  return result.status === 'failed' && policyForGateName(result.name).blocksDownstream
}

export function hasBlockingGateFailure(results: GateResult[]): boolean {
  return results.some(gateBlocksDownstream)
}

export function hasAuthoritativeOrIntegrityFailure(results: GateResult[]): boolean {
  return results.some(result =>
    result.status !== 'passed'
      && policyForGateName(result.name).authority !== 'diagnostic'
  )
}

export function describeGateAuthority(result: GateResult): string {
  return result.authority ?? policyForGateName(result.name).authority
}
