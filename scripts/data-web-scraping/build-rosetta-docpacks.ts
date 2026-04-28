import { buildRosettaDocpacks, parseDocpackArgs } from '../../src/rosetta-source'

async function main(): Promise<void> {
  const options = parseDocpackArgs(process.argv.slice(2))
  const result = await buildRosettaDocpacks({ options })

  console.log(`Snapshot: ${result.snapshotDirectory}`)
  console.log(`Blocks: ${result.extractionManifest.totalBlocks}`)
  console.log(`Functions: ${result.extractionManifest.functionCount}`)
  console.log(`Types: ${result.extractionManifest.typeCount}`)
  console.log(`Enums: ${result.extractionManifest.enumCount}`)
  console.log(`Extracted: ${result.extractedOutputDirectory}`)
  console.log(`Docs: ${result.docsOutputDirectory}`)
  if (options.dryRun) {
    console.log('Dry run only; no extracted artifacts or docs were written.')
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
})
