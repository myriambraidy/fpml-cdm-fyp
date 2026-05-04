import { describe, expect, test } from 'bun:test'
import { renderCdmRosettaPreflightMarkdown } from '../../src/java-generator-agent/cdm-rosetta-preflight'
import type { CdmRosettaPreflightPassedReport } from '../../src/java-generator-agent/cdm-rosetta-preflight'

describe('cdm rosetta preflight', () => {
  test('renders the repo-local validator module in the preflight markdown', () => {
    const report: CdmRosettaPreflightPassedReport = {
      status: 'passed',
      mode: 'repo-local-rosetta-validator',
      generatedAt: '2026-05-04T00:00:00.000Z',
      reportPath: 'generated/java-mapper-poc/cdm-rosetta-preflight/preflight-report.json',
      markdownPath: 'generated/java-mapper-poc/cdm-rosetta-preflight/preflight-report.md',
      cdmArtifact: {
        groupId: 'org.finos.cdm',
        artifactId: 'cdm-java',
        version: '6.7.0',
      },
      validatorModule: {
        pomPath: 'rosetta-validator/pom.xml',
        jarPath: 'rosetta-validator/target/rosetta-validator-1.0.0.jar',
        buildCommand: 'mvn -q -DskipTests package',
      },
      modelRootCandidates: ['cdm.event.common.TradeState', 'cdm.event.common.Trade'],
      requiredClasses: {
        TradeState: 'cdm.event.common.TradeState',
        Trade: 'cdm.event.common.Trade',
      },
      serializer: {
        strategy: 'maven-compile-gated-jackson-serialization',
        notes: 'Use the CDM model object as the internal representation.',
      },
      diagnostics: ['rosetta-validator Maven module was found and packaged successfully.'],
    }

    const markdown = renderCdmRosettaPreflightMarkdown(report)

    expect(markdown).toContain('Mode: repo-local-rosetta-validator')
    expect(markdown).toContain('org.finos.cdm:cdm-java:6.7.0')
    expect(markdown).toContain('- POM: rosetta-validator/pom.xml')
    expect(markdown).toContain('- JAR: rosetta-validator/target/rosetta-validator-1.0.0.jar')
  })
})
