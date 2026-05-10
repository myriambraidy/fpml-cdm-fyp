import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import {
  hasRequiredPlannerSections,
  selectPlannerArtifactContent,
} from '../../src/java-generator-agent/planner-artifact'

const VALID_PLAN = `# Planner Plan

## Implementation scope (machine-checked)

**In scope (implementation groups):**
- fx-single-leg

**Explicitly out of scope (implementation groups):**
- fx-swap

## Runtime supported fixtures (machine-checked)

- fx-single-leg-basic

## Java shell contract (machine-checked)

- Generated package: com.fpml.cdm.fx.mapper.generated
- Main generated class: GeneratedFpmlToCdmMapper
- Required interface: com.fpml.cdm.fx.mapper.FpmlToCdmMapper
- Generated source root: src/main/java/com/fpml/cdm/fx/mapper/generated
- Shell-owned files:
  - pom.xml

## Rosetta evidence coverage (machine-checked)

- product-root: MapFxSingleLegProduct
`

describe('planner artifact selection', () => {
  test('detects required planner machine sections', () => {
    expect(hasRequiredPlannerSections(VALID_PLAN)).toBe(true)
    expect(hasRequiredPlannerSections('[tool calls requested]')).toBe(false)
  })

  test('preserves valid tool-written planner artifact when final model content is tool-only', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'planner-artifact-'))
    try {
      const artifactPath = join(dir, 'planner-plan.md')
      await writeFile(artifactPath, VALID_PLAN, 'utf8')

      const selected = await selectPlannerArtifactContent({
        modelContent: '[tool calls requested]',
        artifactPath,
      })

      expect(selected).toBe(VALID_PLAN)
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })

  test('keeps valid final model planner content over an existing artifact', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'planner-artifact-'))
    try {
      const artifactPath = join(dir, 'planner-plan.md')
      await writeFile(artifactPath, VALID_PLAN.replace('fx-single-leg-basic', 'old-fixture'), 'utf8')

      const selected = await selectPlannerArtifactContent({
        modelContent: VALID_PLAN,
        artifactPath,
      })

      expect(selected).toBe(VALID_PLAN)
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })
})
