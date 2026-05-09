import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import { synthesizeAcceptedPlan } from '../../src/java-generator-agent/accepted-plan'

describe('accepted plan synthesis', () => {
  test('places machine-checked Java contract and API guardrails before narrative', async () => {
    const root = await mkdtemp(join(tmpdir(), 'accepted-plan-'))
    try {
      const productScopePath = join(root, 'scope.md')
      const plannerPath = join(root, 'planner.md')
      const criticPath = join(root, 'critic.md')
      const resolutionPath = join(root, 'resolution.md')
      const validationPath = join(root, 'validation.md')
      const outputPath = join(root, 'accepted.md')

      await writeFile(productScopePath, '# Product Scope\n', 'utf8')
      await writeFile(plannerPath, '# Planner\n', 'utf8')
      await writeFile(criticPath, '# Critic\n', 'utf8')
      await writeFile(resolutionPath, '# Resolution\n', 'utf8')
      await writeFile(validationPath, '# Plan Validation\nStatus: passed\n', 'utf8')

      await synthesizeAcceptedPlan({
        round: 1,
        productScopePath,
        evidencePacketPath: join(root, 'evidence.md'),
        plannerPath,
        criticPath,
        resolutionPath,
        validationPath,
        outputPath,
      })

      const accepted = await Bun.file(outputPath).text()
      const machineIndex = accepted.indexOf('## Machine-Checked Implementation Contract')
      const plannerIndex = accepted.indexOf('## Planner Plan')
      expect(machineIndex).toBeGreaterThanOrEqual(0)
      expect(plannerIndex).toBeGreaterThan(machineIndex)
      expect(accepted).toContain('Generated package: com.fpml.cdm.fx.mapper.generated')
      expect(accepted).toContain('Use TradeState.builder().setTrade(trade).build()')
      expect(accepted).toContain('Do not use ProductIdentifier or ProductTaxonomy as Java implementation classes')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})
