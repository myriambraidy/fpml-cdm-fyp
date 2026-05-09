import { describe, expect, test } from 'bun:test'
import { renderGoodJavaGuaranteeReview } from '../../src/java-generator-agent/good-java-guarantee-review'

describe('good java guarantee review', () => {
  test('renders explicit verdict fields', () => {
    const markdown = renderGoodJavaGuaranteeReview({
      overallVerdict: 'fail',
      runId: 'test-run',
      approvedClassCount: 38,
      recipeDerivedFixtureCount: 5,
      compileStatus: 'failed',
      runtimeFixtureStatus: 'not-run',
      blockingFailures: ['maven-compile failed'],
      nonBlockingGaps: [],
      gapReportPath: 'agent-workspace/final-build-report.md',
    })

    expect(markdown).toContain('overall_verdict: fail')
    expect(markdown).toContain('approved_class_count: 38')
    expect(markdown).toContain('recipe_derived_fixture_count: 5')
    expect(markdown).toContain('maven-compile failed')
  })
})
