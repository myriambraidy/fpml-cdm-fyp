import { indexRosettaSource, parseIndexArgs } from '../../src/rosetta-source'

async function main(): Promise<void> {
  const options = parseIndexArgs(process.argv.slice(2))
  const result = await indexRosettaSource({ options })

  console.log(`Snapshot: ${result.indexManifest.snapshotDirectory}`)
  console.log(`Indexed files: ${result.indexManifest.indexedFileCount}`)
  console.log(`FpML-relevant files: ${result.categories.fpmlRelevantCount}`)
  console.log(`Output: ${result.outputDirectory}`)
  if (options.dryRun) {
    console.log('Dry run only; no index files were written.')
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
})
