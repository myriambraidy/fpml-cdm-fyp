import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import { DEFAULT_RUNTIME_FIXTURES } from '../../src/java-generator-agent/java-contract'
import { createJavaProjectShell } from '../../src/java-generator-agent/java-shell'
import type {
  GeneratorRole,
  GeneratorRunConfig,
  RoleModelConfig,
} from '../../src/java-generator-agent/types'

describe('java generator shell', () => {
  test('creates deterministic Maven and CLI shell files', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-shell-'))
    try {
      const config = makeConfig(root)
      await createJavaProjectShell(config)

      const pom = await Bun.file(join(config.runOutputDir, 'pom.xml')).text()
      const main = await Bun.file(join(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper/Main.java')).text()
      const runtimeArgs = await Bun.file(
        join(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper/RuntimeArgs.java')
      ).text()
      const mapperInterface = await Bun.file(
        join(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper/FpmlToCdmMapper.java')
      ).text()
      const generatedSkeleton = await Bun.file(
        join(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper/generated/GeneratedFpmlToCdmMapper.java')
      ).text()

      expect(pom).toContain('<artifactId>fpml-cdm-rosetta-mapper</artifactId>')
      expect(pom).toContain('<maven.compiler.release>11</maven.compiler.release>')
      expect(pom).toContain('<mainClass>com.fpml.cdm.fx.mapper.Main</mainClass>')
      expect(main).toContain('new GeneratedFpmlToCdmMapper()')
      expect(mapperInterface).toContain('interface FpmlToCdmMapper')
      expect(generatedSkeleton).toContain('public class GeneratedFpmlToCdmMapper implements FpmlToCdmMapper')
      expect(generatedSkeleton).toContain('public String mapFile(Path inputPath, Path reportsDir) throws Exception')
      expect(generatedSkeleton).toContain('mapTradeState')
      expect(generatedSkeleton).toContain('FxForwardTrade')
      expect(runtimeArgs).not.toContain('record RuntimeArgs')
      expect(runtimeArgs).toContain('--output')
      expect(
        await Bun.file(join(config.runOutputDir, 'fixtures', DEFAULT_RUNTIME_FIXTURES[0].fixtureFileName)).exists()
      ).toBe(true)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('does not overwrite existing agent-owned shell files on resume', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-shell-'))
    try {
      const config = makeConfig(root)
      await createJavaProjectShell(config)
      await Bun.write(join(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper/Main.java'), 'custom')
      await createJavaProjectShell(config)

      expect(await Bun.file(join(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper/Main.java')).text()).toBe(
        'custom'
      )
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
