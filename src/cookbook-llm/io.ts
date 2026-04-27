import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { markdownPathForPacket, safeName } from './render'
import { splitLlmValidationIssues } from './validate'
import type {
  AuthoredPageResult,
  CookbookEvidencePacket,
  CookbookLlmRunResult,
  LlmCookbookAuthoringDebug,
  LlmCookbookManifest,
  LlmCookbookValidationIssue,
  LlmCookbookWriteInput,
} from './types'

export function buildLlmOutputDirectory(args: {
  outputRoot: string
  mode: 'overwrite' | 'append'
  generatedAt: string
}): string {
  if (args.mode === 'overwrite') return join(args.outputRoot, 'latest')
  return join(args.outputRoot, 'runs', sanitizeTimestamp(args.generatedAt))
}

export async function readSourceManifest(path: string): Promise<LlmCookbookManifest['sourceManifest']> {
  return JSON.parse(await readFile(path, 'utf8')) as LlmCookbookManifest['sourceManifest']
}

export async function writeAuthoredCookbook(args: LlmCookbookWriteInput): Promise<CookbookLlmRunResult> {
  await writeOutputDirectory(args.outputDirectory, args)

  let latestDirectory: string | undefined
  if (args.config.mode === 'append') {
    latestDirectory = join(args.config.outputRoot, 'latest')
    await writeOutputDirectory(latestDirectory, {
      ...args,
      outputDirectory: latestDirectory,
      manifest: {
        ...args.manifest,
        outputRoot: latestDirectory,
      },
    })
  }

  const counts = splitLlmValidationIssues(args.validationIssues)
  return {
    generatedAt: args.generatedAt,
    outputDirectory: args.outputDirectory,
    latestDirectory,
    manifestPath: join(args.outputDirectory, 'manifest.json'),
    pageCount: args.results.length,
    validationErrorCount: counts.errorCount,
    validationWarningCount: counts.warningCount,
  }
}

export async function writeFailedAuthoringRun(args: {
  config: LlmCookbookWriteInput['config']
  generatedAt: string
  packets: CookbookEvidencePacket[]
  results: AuthoredPageResult[]
  validationIssues: LlmCookbookValidationIssue[]
  debug: LlmCookbookAuthoringDebug
}): Promise<string> {
  const outputDirectory = join(args.config.outputRoot, 'failed-run', sanitizeTimestamp(args.generatedAt))
  assertSafeOutputDirectory(args.config.outputRoot, outputDirectory)
  await rm(outputDirectory, { recursive: true, force: true })
  await mkdir(outputDirectory, { recursive: true })
  await mkdir(join(outputDirectory, 'pages'), { recursive: true })

  await writeFile(join(outputDirectory, 'authoring-debug.json'), JSON.stringify(args.debug, null, 2), 'utf8')
  await writeFile(join(outputDirectory, 'validation.json'), JSON.stringify(args.validationIssues, null, 2), 'utf8')

  for (const result of args.results) {
    await writeFile(
      join(outputDirectory, 'pages', `${safeName(result.packetId)}.md`),
      result.finalPage.markdown,
      'utf8'
    )
  }
  await writeFile(
    join(outputDirectory, 'packets.json'),
    JSON.stringify(args.packets.map(packet => ({ id: packet.id, title: packet.title })), null, 2),
    'utf8'
  )
  return outputDirectory
}

async function writeOutputDirectory(
  outputDirectory: string,
  args: LlmCookbookWriteInput
): Promise<void> {
  assertSafeOutputDirectory(args.config.outputRoot, outputDirectory)
  await rm(outputDirectory, { recursive: true, force: true })
  await mkdir(outputDirectory, { recursive: true })
  await mkdir(join(outputDirectory, 'global'), { recursive: true })
  await mkdir(join(outputDirectory, 'product-families'), { recursive: true })
  await mkdir(join(outputDirectory, 'review-only'), { recursive: true })
  await mkdir(join(outputDirectory, 'references'), { recursive: true })

  for (const result of args.results) {
    const packet = args.packets.find(item => item.id === result.packetId)
    const markdownPath = packet
      ? markdownPathForPacket(packet)
      : `failed/${safeName(result.packetId)}.md`
    await writeMarkdown(outputDirectory, markdownPath, result.finalPage.markdown)
  }

  await copyReferences(args.config.deterministicRoot, outputDirectory)
  await writeFile(join(outputDirectory, 'manifest.json'), JSON.stringify(args.manifest, null, 2), 'utf8')
  await writeFile(join(outputDirectory, 'validation.json'), JSON.stringify(args.validationIssues, null, 2), 'utf8')
  await writeFile(join(outputDirectory, 'authoring-debug.json'), JSON.stringify(args.debug, null, 2), 'utf8')
}

async function writeMarkdown(outputDirectory: string, markdownPath: string, markdown: string): Promise<void> {
  const absolutePath = join(outputDirectory, markdownPath)
  await mkdir(dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, markdown, 'utf8')
}

async function copyReferences(deterministicRoot: string, outputDirectory: string): Promise<void> {
  const source = join(deterministicRoot, 'references')
  const target = join(outputDirectory, 'references')
  try {
    await cp(source, target, { recursive: true, force: true })
  } catch {
    await mkdir(target, { recursive: true })
  }
}

function assertSafeOutputDirectory(outputRoot: string, outputDirectory: string): void {
  const root = resolve(outputRoot)
  const target = resolve(outputDirectory)
  if (!isAbsolute(root) || !isAbsolute(target)) {
    throw new Error('LLM cookbook output paths must be absolute.')
  }
  const relativeTarget = relative(root, target)
  if (relativeTarget.startsWith('..') || relativeTarget === '') {
    throw new Error(`Unsafe LLM cookbook output directory: ${target}`)
  }
}

function sanitizeTimestamp(value: string): string {
  return value.replace(/[:.]/g, '-')
}
