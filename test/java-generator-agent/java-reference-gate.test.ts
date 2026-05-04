import { mkdir, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import {
  findJavaReferenceFindings,
  runJavaReferenceGate,
} from '../../src/java-generator-agent/java-reference-gate'
import { DEFAULT_RUNTIME_FIXTURES } from '../../src/java-generator-agent/java-contract'
import type {
  GeneratorRole,
  GeneratorRunConfig,
  RoleModelConfig,
} from '../../src/java-generator-agent/types'

describe('java generator reference gate', () => {
  test('fails project imports that do not match generated classes', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-references-'))
    try {
      const sourceDir = join(root, 'src/main/java/com/fpml/cdm/fx/mapper')
      await mkdir(sourceDir, { recursive: true })
      await Bun.write(
        join(sourceDir, 'Bad.java'),
        [
          'package com.fpml.cdm.fx.mapper;',
          'import com.fpml.cdm.fx.model.*;',
          'import com.fpml.cdm.fx.missing.Missing;',
          'public class Bad {}',
        ].join('\n')
      )

      const findings = await findJavaReferenceFindings(root)
      const imports = findings.map(finding => finding.importName)

      expect(imports).toContain('com.fpml.cdm.fx.model.*')
      expect(imports).toContain('com.fpml.cdm.fx.missing.Missing')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('passes generated project imports that exist', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-references-'))
    try {
      const mapperDir = join(root, 'src/main/java/com/fpml/cdm/fx/mapper')
      const helperDir = join(root, 'src/main/java/com/fpml/cdm/fx/helper')
      await mkdir(mapperDir, { recursive: true })
      await mkdir(helperDir, { recursive: true })
      await Bun.write(
        join(mapperDir, 'Good.java'),
        'package com.fpml.cdm.fx.mapper;\nimport com.fpml.cdm.fx.helper.Helper;\npublic class Good {}\n'
      )
      await Bun.write(join(helperDir, 'Helper.java'), 'package com.fpml.cdm.fx.helper;\npublic class Helper {}\n')

      const findings = await findJavaReferenceFindings(root)

      expect(findings).toHaveLength(0)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('writes Java reference report', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-references-'))
    try {
      const config = makeConfig(root)
      const sourceDir = join(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper')
      await mkdir(sourceDir, { recursive: true })
      await Bun.write(join(sourceDir, 'Good.java'), 'package com.fpml.cdm.fx.mapper;\npublic class Good {}\n')

      const result = await runJavaReferenceGate(config)

      expect(result.status).toBe('passed')
      expect(await Bun.file(join(config.runOutputDir, 'build-reports/java-reference-check.json')).exists()).toBe(true)
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
