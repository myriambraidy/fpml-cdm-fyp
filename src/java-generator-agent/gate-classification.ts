import type { GateResult } from './types'

export type GateFailureCategory =
  | 'typescript'
  | 'structure'
  | 'shell-contract'
  | 'static-java'
  | 'dependency'
  | 'main-compile'
  | 'test-compile'
  | 'test-runtime'
  | 'package'
  | 'runtime'
  | 'output'
  | 'generated_entrypoint_signature'
  | 'unknown'

export type GateFailureClassification = {
  earliestFailedGate?: string
  category?: GateFailureCategory
  hiddenDownstreamGates: string[]
}

export function classifyGateFailures(results: GateResult[]): GateFailureClassification {
  const earliest = results.find(result => result.status === 'failed')
  if (earliest === undefined) return { hiddenDownstreamGates: [] }
  const earliestIndex = results.indexOf(earliest)
  return {
    earliestFailedGate: earliest.name,
    category: categoryForGate(earliest),
    hiddenDownstreamGates: results
      .slice(earliestIndex + 1)
      .filter(result => result.status === 'skipped')
      .map(result => result.name),
  }
}

export function renderGateFailureClassification(results: GateResult[]): string {
  const classification = classifyGateFailures(results)
  if (classification.earliestFailedGate === undefined) {
    return `## Failure Classification

- Earliest failed gate: none
- Category: none
- Hidden downstream gates: none
`
  }
  return `## Failure Classification

- Earliest failed gate: ${classification.earliestFailedGate}
- Category: ${classification.category ?? 'unknown'}
- Hidden downstream gates: ${
    classification.hiddenDownstreamGates.length === 0 ? 'none' : classification.hiddenDownstreamGates.join(', ')
  }
`
}

function categoryForGate(gate: GateResult): GateFailureCategory {
  const gateName = gate.name
  if (
    gate.outputSnippet.includes('mapFile must return String')
    || gate.outputSnippet.includes('mapFile must accept Path inputPath')
  ) {
    return 'generated_entrypoint_signature'
  }
  if (gateName === 'typescript-typecheck') return 'typescript'
  if (gateName === 'generated-project-structure') return 'structure'
  if (gateName === 'generated-shell-contract') return 'shell-contract'
  if (gateName === 'source-hygiene' || gateName === 'generated-java-static-sanity') return 'static-java'
  if (gateName === 'generated-test-shell-contract') return 'shell-contract'
  if (gateName === 'java-reference-check') return 'static-java'
  if (gateName === 'maven-dependency-preflight') return 'dependency'
  if (gateName === 'maven-compile') return 'main-compile'
  if (gateName === 'maven-test-compile') return 'test-compile'
  if (gateName === 'maven-test') return 'test-runtime'
  if (gateName === 'maven-package') return 'package'
  if (gateName.startsWith('jar-runtime')) return 'runtime'
  if (gateName === 'output-validation') return 'output'
  return 'unknown'
}
