import { describe, expect, test } from 'bun:test'
import { classifyGateFailures } from '../../src/java-generator-agent/gate-classification'

describe('gate failure classification', () => {
  test('does not list passed gates as hidden downstream gates', () => {
    const classification = classifyGateFailures([
      {
        name: 'generated-java-static-sanity',
        command: 'diagnose',
        status: 'failed',
        exitCode: 1,
        outputSnippet: 'finding',
      },
      {
        name: 'java-reference-check',
        command: 'check references',
        status: 'passed',
        exitCode: 0,
        outputSnippet: 'passed',
      },
      {
        name: 'maven-compile',
        command: 'mvn compile',
        status: 'skipped',
        exitCode: 0,
        outputSnippet: 'skipped',
      },
    ])

    expect(classification.hiddenDownstreamGates).toEqual(['maven-compile'])
  })

  test('classifies generated mapper signature failures', () => {
    const classification = classifyGateFailures([
      {
        name: 'implementation-artifacts',
        command: 'validate implementer write tools and generated Java entrypoint',
        status: 'failed',
        exitCode: 1,
        outputSnippet: [
          'GeneratedFpmlToCdmMapper.java:18 mapFile must return String, found TradeState.',
          'GeneratedFpmlToCdmMapper.java:18 mapFile must accept Path inputPath, Path reportsDir.',
        ].join('\n'),
      },
    ])

    expect(classification.category).toBe('generated_entrypoint_signature')
  })
})
