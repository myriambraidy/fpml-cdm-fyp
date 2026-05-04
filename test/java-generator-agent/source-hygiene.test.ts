import { mkdir, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import { DEFAULT_RUNTIME_FIXTURES } from '../../src/java-generator-agent/java-contract'
import {
  findSourceHygieneFindings,
  runSourceHygieneGate,
} from '../../src/java-generator-agent/source-hygiene'
import type {
  GeneratorRole,
  GeneratorRunConfig,
  RoleModelConfig,
} from '../../src/java-generator-agent/types'

describe('java generator source hygiene', () => {
  test('fails smart quotes, mojibake, html-escaped quotes, and non-ascii Java', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-hygiene-'))
    try {
      const sourceDir = join(root, 'src/main/java/com/fpml/cdm/fx/mapper')
      await mkdir(sourceDir, { recursive: true })
      await Bun.write(
        join(sourceDir, 'Bad.java'),
        'package com.fpml.cdm.fx.mapper;\npublic class Bad { String a = “x”; String b = "&quot;y&quot;"; String c = "â€œ"; }\n'
      )

      const findings = await findSourceHygieneFindings(root)
      const codes = findings.map(finding => finding.code)

      expect(codes).toContain('smart_quotes')
      expect(codes).toContain('mojibake_quotes')
      expect(codes).toContain('html_escaped_quotes')
      expect(codes).toContain('non_ascii_java')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('writes source hygiene report', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-hygiene-'))
    try {
      const config = makeConfig(root)
      await mkdir(join(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper'), { recursive: true })
      await Bun.write(
        join(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper/Good.java'),
        'package com.fpml.cdm.fx.mapper;\npublic class Good {}\n'
      )

      const result = await runSourceHygieneGate(config)

      expect(result.status).toBe('passed')
      expect(await Bun.file(join(config.runOutputDir, 'build-reports/source-hygiene.json')).exists()).toBe(true)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})

function makeConfig(root: string): GeneratorRunConfig {
  return {
    runId: 'test-run',
    productFamily: 'fx-derivatives',
    supportedProducts: [],
    baseOutputDir: root,
    runOutputDir: join(root, 'runs', 'test-run'),
    maxPlanningRounds: 3,
    maxRepairAttempts: 3,
    requireApproval: false,
    resume: false,
    evidenceRoots: ['data_to_learn_from/fpml/fx-derivatives'],
    fixturePaths: ['data_to_learn_from/fpml/fx-derivatives/fx-ex01-fx-spot.xml'],
    expectedCdmPaths: ['data_to_learn_from/cdm_parallel/fx-derivatives/fx-ex01-fx-spot.json'],
    runtimeFixtures: DEFAULT_RUNTIME_FIXTURES,
    roleModels: makeRoleModels(),
  }
}

function makeRoleModels(): Record<GeneratorRole, RoleModelConfig> {
  return {
    planner: { model: 'qwen/qwen3-coder-30b-a3b-instruct', maxTokens: 9000, maxToolRounds: 3 },
    critic: { model: 'qwen/qwen3-coder-next', maxTokens: 5000, maxToolRounds: 3 },
    'critique-reviewer': { model: 'qwen/qwen3-coder-next', maxTokens: 5000, maxToolRounds: 2 },
    implementer: { model: 'minimax/minimax-m2.7', maxTokens: 16_000, maxToolRounds: 6 },
    repair: { model: 'minimax/minimax-m2.7', maxTokens: 12_000, maxToolRounds: 6 },
    'build-reviewer': { model: 'qwen/qwen3-coder-next', maxTokens: 4000, maxToolRounds: 2 },
  }
}
