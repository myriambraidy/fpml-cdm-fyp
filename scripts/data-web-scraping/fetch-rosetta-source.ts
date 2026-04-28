import { fetchRosettaSource, parseArgs } from '../../src/rosetta-source'

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2))
  const result = await fetchRosettaSource({ options })

  console.log(`Repo: ${result.manifest.repo}@${result.manifest.branch}`)
  console.log(`Prefix: ${result.manifest.sourcePrefix}`)
  console.log(`Files matched: ${result.manifest.fileCount}`)
  console.log(`Output: ${result.outputDirectory}`)
  if (result.latestDirectory) {
    console.log(`Latest: ${result.latestDirectory}`)
  }
  if (result.diagnostics.warnings.length > 0) {
    for (const warning of result.diagnostics.warnings) {
      console.warn(`Warning: ${warning}`)
    }
  }
  if (options.dryRun) {
    for (const file of result.manifest.files) {
      console.log(file.sourcePath)
    }
    console.log('Dry run only; no files were downloaded.')
    return
  }
  console.log(`Downloaded: ${result.manifest.fileCount} files`)
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
})
