import { describe, expect, test } from 'bun:test'
import { gateBlocksDownstream, hasAuthoritativeOrIntegrityFailure } from '../../src/java-generator-agent/gate-policy'

describe('gate authority policy', () => {
  test('diagnostic failures do not block downstream Maven gates', () => {
    expect(gateBlocksDownstream({
      name: 'cdm-java-api-usage',
      command: 'diagnose',
      status: 'failed',
      exitCode: 1,
      outputSnippet: 'diagnostic finding',
    })).toBe(false)
  })

  test('pipeline integrity failures block downstream Maven gates', () => {
    expect(gateBlocksDownstream({
      name: 'generated-project-structure',
      command: 'check structure',
      status: 'failed',
      exitCode: 1,
      outputSnippet: 'missing pom.xml',
    })).toBe(true)
  })

  test('diagnostic-only failures do not prevent promotion', () => {
    expect(hasAuthoritativeOrIntegrityFailure([
      {
        name: 'cdm-java-api-usage',
        command: 'diagnose',
        status: 'failed',
        exitCode: 1,
        outputSnippet: 'curated contract finding',
      },
      {
        name: 'maven-compile',
        command: 'mvn compile',
        status: 'passed',
        exitCode: 0,
        outputSnippet: '',
      },
    ])).toBe(false)
  })
})
