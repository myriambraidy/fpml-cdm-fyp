import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import { extractJavaFileRefs, writeRepairFocusPacket } from '../../src/java-generator-agent/repair-focus'
import type { GateResult, GeneratorRunConfig } from '../../src/java-generator-agent/types'

describe('repair focus packet', () => {
  test('writes failed gate output and affected Java excerpt', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-repair-focus-'))
    try {
      const runOutputDir = join(root, 'runs', 'test-run')
      const javaPath = join(runOutputDir, 'src', 'main', 'java', 'com', 'example', 'FxSingleLegMapper.java')
      await mkdir(dirname(javaPath), { recursive: true })
      await writeFile(javaPath, Array.from({ length: 210 }, (_, index) => `line ${index + 1}`).join('\n'), 'utf8')
      const gates: GateResult[] = [
        {
          name: 'maven-compile',
          command: 'mvn -q -DskipTests compile',
          status: 'failed',
          exitCode: 1,
          outputSnippet: `${javaPath}:[167,34] cannot find symbol`,
        },
      ]
      const outputPath = join(runOutputDir, 'build-reports', 'repair-focus-attempt-1.md')

      const packet = await writeRepairFocusPacket({
        config: makeConfig(root, runOutputDir),
        gateResults: gates,
        attempt: 1,
        outputPath,
      })

      const markdown = await readFile(outputPath, 'utf8')
      expect(packet.earliestFailedGate).toBe('maven-compile')
      expect(packet.excerpts[0]?.startLine).toBe(142)
      expect(packet.excerpts[0]?.endLine).toBe(192)
      expect(markdown).toContain('Focused Repair Packet')
      expect(markdown).toContain('cannot find symbol')
      expect(markdown).toContain('167: line 167')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('extracts Java refs from JSON gate output file fields', () => {
    const runOutputDir = join('C:', 'tmp', 'run')
    const refs = extractJavaFileRefs(
      runOutputDir,
      JSON.stringify([
        {
          file: 'src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\Main.java',
          line: 8,
          message: 'Missing import target',
        },
      ])
    )

    expect(refs[0]?.path.replace(/\\/g, '/')).toContain('src/main/java/com/fpml/cdm/fx/mapper/Main.java')
    expect(refs[0]?.line).toBe(8)
  })
})

function makeConfig(root: string, runOutputDir: string): GeneratorRunConfig {
  return {
    runId: 'test-run',
    productFamily: 'fx-derivatives',
    supportedProducts: [],
    baseOutputDir: root,
    runOutputDir,
    maxPlanningRounds: 1,
    maxRepairAttempts: 2,
    requireApproval: false,
    resume: false,
    evidenceRoots: [],
    fixturePaths: [],
    expectedCdmPaths: [],
    runtimeFixtures: [],
    roleModels: {
      planner: { model: 'qwen/qwen3-coder-next', maxTokens: 1000, maxToolRounds: 1 },
      critic: { model: 'qwen/qwen3-coder-next', maxTokens: 1000, maxToolRounds: 1 },
      'critique-reviewer': { model: 'qwen/qwen3-coder-next', maxTokens: 1000, maxToolRounds: 1 },
      implementer: { model: 'minimax/minimax-m2.7', maxTokens: 1000, maxToolRounds: 1 },
      repair: { model: 'qwen/qwen3-coder-next', maxTokens: 1000, maxToolRounds: 1 },
      'build-reviewer': { model: 'qwen/qwen3-coder-next', maxTokens: 1000, maxToolRounds: 1 },
    },
  }
}
