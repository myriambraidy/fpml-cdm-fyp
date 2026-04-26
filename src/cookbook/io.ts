import { mkdir, rm, writeFile } from 'node:fs/promises'
import { isAbsolute, join, relative, resolve } from 'node:path'
import {
  renderFamilyMarkdown,
  renderGlobalMarkdown,
  renderIndexMarkdown,
} from './render-markdown'
import type {
  CookbookFamilyDocument,
  CookbookGlobalDocument,
  CookbookRunResult,
  CookbookValidationIssue,
  CookbookWriteArtifactsInput,
} from './types'
import { splitValidationIssues } from './validate'

export function buildRunOutputDirectory(args: {
  outputRoot: string
  mode: 'overwrite' | 'append'
  generatedAt: string
}): string {
  if (args.mode === 'overwrite') {
    return join(args.outputRoot, 'latest')
  }
  return join(args.outputRoot, 'runs', sanitizeTimestamp(args.generatedAt))
}

export async function writeCookbookArtifacts(args: CookbookWriteArtifactsInput): Promise<CookbookRunResult> {
  await writeCookbookDirectory(args.outputDirectory, args)

  let latestDirectory: string | undefined
  if (args.config.mode === 'append' && args.config.updateLatest) {
    latestDirectory = join(args.config.outputRoot, 'latest')
    await writeCookbookDirectory(latestDirectory, {
      ...args,
      outputDirectory: latestDirectory,
      manifest: {
        ...args.manifest,
        outputRoot: latestDirectory,
      },
      comparison: undefined,
    })
  }

  const counts = splitValidationIssues(args.validationIssues)
  return {
    generatedAt: args.generatedAt,
    outputDirectory: args.outputDirectory,
    latestDirectory,
    manifestPath: join(args.outputDirectory, 'manifest.json'),
    familyDocumentCount: args.familyDocuments.length,
    globalDocumentCount: args.globalDocuments.length,
    validationErrorCount: counts.errorCount,
    validationWarningCount: counts.warningCount,
  }
}

async function writeCookbookDirectory(
  outputDirectory: string,
  args: CookbookWriteArtifactsInput
): Promise<void> {
  assertSafeOutputDirectory(args.config.outputRoot, outputDirectory)
  await rm(outputDirectory, { recursive: true, force: true })
  await mkdir(outputDirectory, { recursive: true })
  await mkdir(join(outputDirectory, 'global'), { recursive: true })
  await mkdir(join(outputDirectory, 'product-families'), { recursive: true })
  await mkdir(join(outputDirectory, 'review-only'), { recursive: true })
  await mkdir(join(outputDirectory, 'references'), { recursive: true })

  await writeFile(
    join(outputDirectory, 'index.md'),
    renderIndexMarkdown({
      manifest: args.manifest,
      familyDocuments: args.familyDocuments,
      globalDocuments: args.globalDocuments,
    }),
    'utf8'
  )
  await writeFile(join(outputDirectory, 'manifest.json'), JSON.stringify(args.manifest, null, 2), 'utf8')
  await writeFile(join(outputDirectory, 'validation.json'), JSON.stringify(args.validationIssues, null, 2), 'utf8')
  if (args.comparison) {
    await writeFile(join(outputDirectory, 'comparison.json'), JSON.stringify(args.comparison, null, 2), 'utf8')
  }

  for (const document of args.globalDocuments) {
    await writeFile(join(outputDirectory, 'global', `${document.slug}.md`), renderGlobalMarkdown(document), 'utf8')
  }

  for (const document of args.familyDocuments) {
    await writeFile(familyDocumentPath(outputDirectory, document), renderFamilyMarkdown(document), 'utf8')
  }

  for (const sidecar of args.evidenceSidecars) {
    await writeFile(
      join(outputDirectory, 'references', `${sidecar.folder}.evidence.json`),
      JSON.stringify(sidecar, null, 2),
      'utf8'
    )
  }
}

function familyDocumentPath(outputDirectory: string, document: CookbookFamilyDocument): string {
  if (document.readiness.operationalStatus === 'ready' || document.readiness.operationalStatus === 'pilot_only') {
    return join(outputDirectory, 'product-families', `${document.folder}.md`)
  }
  return join(outputDirectory, 'review-only', `${document.folder}.md`)
}

function assertSafeOutputDirectory(outputRoot: string, outputDirectory: string): void {
  const root = resolve(outputRoot)
  const target = resolve(outputDirectory)
  if (!isAbsolute(root) || !isAbsolute(target)) {
    throw new Error('Cookbook output paths must be absolute.')
  }
  const relativeTarget = relative(root, target)
  if (relativeTarget.startsWith('..') || relativeTarget === '') {
    throw new Error(`Unsafe cookbook output directory: ${target}`)
  }
}

function sanitizeTimestamp(value: string): string {
  return value.replace(/[:.]/g, '-')
}
