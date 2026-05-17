import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { hasAuthoritativeOrIntegrityFailure } from './gate-policy'
import { GENERATED_JAR_NAME } from './java-contract'
import type { GateResult, GeneratorRunConfig } from './types'

export async function promoteGeneratedJar(config: GeneratorRunConfig, gateResults: GateResult[]): Promise<boolean> {
  if (hasAuthoritativeOrIntegrityFailure(gateResults)) return false

  const sourceJar = join(config.runOutputDir, 'target', `${GENERATED_JAR_NAME}.jar`)
  const targetDir = join(config.baseOutputDir, 'target')
  const targetJar = join(targetDir, `${GENERATED_JAR_NAME}.jar`)
  await mkdir(targetDir, { recursive: true })
  await copyFile(sourceJar, targetJar)
  await writeFile(
    join(targetDir, 'latest-promoted-run.md'),
    `# Latest Promoted Java Mapper Run

Run id: ${config.runId}
Run output dir: ${config.runOutputDir}
Jar: ${targetJar}
`,
    'utf8'
  )
  return true
}
