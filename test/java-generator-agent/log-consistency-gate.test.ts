import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import { runLogConsistencyGate } from '../../src/java-generator-agent/log-consistency-gate'
import type { GeneratorRunConfig } from '../../src/java-generator-agent/types'

function baseConfig(runOutputDir: string): GeneratorRunConfig {
  return {
    runId: 't',
    productFamily: 'fx-derivatives',
    supportedProducts: [],
    baseOutputDir: join(runOutputDir, '..'),
    runOutputDir,
    maxPlanningRounds: 1,
    maxRepairAttempts: 1,
    requireApproval: false,
    resume: false,
    evidenceRoots: [],
    fixturePaths: [],
    expectedCdmPaths: [],
    runtimeFixtures: [],
    roleModels: {
      planner: { model: 'm', maxTokens: 1, maxToolRounds: 1 },
      critic: { model: 'm', maxTokens: 1, maxToolRounds: 1 },
      'critique-reviewer': { model: 'm', maxTokens: 1, maxToolRounds: 1 },
      implementer: { model: 'm', maxTokens: 1, maxToolRounds: 1 },
      repair: { model: 'm', maxTokens: 1, maxToolRounds: 1 },
      'build-reviewer': { model: 'm', maxTokens: 1, maxToolRounds: 1 },
    },
  }
}

describe('runLogConsistencyGate', () => {
  test('passes minimal run with no repair attempts', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-log-consistency-'))
    try {
      await mkdir(join(root, 'build-reports'), { recursive: true })
      await mkdir(join(root, 'agent-workspace'), { recursive: true })
      await writeFile(
        join(root, 'build-reports/run-events.jsonl'),
        '{"schemaVersion":1,"eventId":"e1","sequence":1}\n',
        'utf8'
      )
      await writeFile(join(root, 'build-reports/tool-audit-log.json'), '[]', 'utf8')
      await writeFile(join(root, 'agent-workspace/repair-log.md'), '# Repair\n', 'utf8')

      const result = await runLogConsistencyGate(baseConfig(root))
      expect(result.status).toBe('passed')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('fails when repair attempt file exists without per-attempt artifact report', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-log-consistency-'))
    try {
      await mkdir(join(root, 'build-reports'), { recursive: true })
      await mkdir(join(root, 'agent-workspace'), { recursive: true })
      await writeFile(
        join(root, 'build-reports/run-events.jsonl'),
        '{"schemaVersion":1,"eventId":"e1","sequence":1}\n',
        'utf8'
      )
      await writeFile(join(root, 'build-reports/tool-audit-log.json'), '[]', 'utf8')
      await writeFile(
        join(root, 'agent-workspace/repair-log.md'),
        '## Attempt 1\n- [repair-attempt-01.md](repair-attempt-01.md)\n',
        'utf8'
      )
      await writeFile(join(root, 'agent-workspace/repair-attempt-01.md'), '# a\n', 'utf8')
      await writeFile(join(root, 'build-reports/failed-gates-attempt-1.json'), '[]', 'utf8')
      await writeFile(join(root, 'build-reports/failure-classification-attempt-1.md'), 'x\n', 'utf8')

      const result = await runLogConsistencyGate(baseConfig(root))
      expect(result.status).toBe('failed')
      expect(result.outputSnippet).toContain('repair-artifact-report-attempt-01.json')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('flags invalid event line', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-log-consistency-'))
    try {
      await mkdir(join(root, 'build-reports'), { recursive: true })
      await mkdir(join(root, 'agent-workspace'), { recursive: true })
      await writeFile(join(root, 'build-reports/run-events.jsonl'), 'not-json\n', 'utf8')
      await writeFile(join(root, 'build-reports/tool-audit-log.json'), '[]', 'utf8')
      await writeFile(join(root, 'agent-workspace/repair-log.md'), '# r\n', 'utf8')

      const result = await runLogConsistencyGate(baseConfig(root))
      expect(result.status).toBe('failed')
      expect(result.outputSnippet).toContain('invalid JSON')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})
