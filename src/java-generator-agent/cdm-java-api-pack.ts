import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { CDM_JAVA_VERSION } from './java-contract'
import { truncateForLog } from './markdown'

export type CdmJavaArtifactPaths = {
  jarPath: string
  sourcesJarPath?: string
  javadocJarPath?: string
}

export type CdmJavaClassIndexEntry = {
  className: string
  packageName: string
  simpleName: string
  classFile: string
}

export type CdmJavaMethodSignature = {
  name: string
  returnType: string
  parameters: string[]
  raw: string
}

export type CdmJavaClassDetails = {
  className: string
  exists: true
  packageName: string
  simpleName: string
  methods: CdmJavaMethodSignature[]
  builderClassName?: string
  builderMethods: CdmJavaMethodSignature[]
  enumValues?: string[]
}

export type CdmJavaMissingClassObservation = {
  className: string
  exists: false
  reason: string
  sameSimpleNameCandidates?: string[]
  authority: 'compiled-jar-javap'
}

export type CdmJavaApiManifest = {
  groupId: 'org.finos.cdm'
  artifactId: 'cdm-java'
  version: string
  mavenDirectory: string
  javadocUrl: string
  generatedAt: string
  jarPath: string
  sourcesJarPath?: string
  javadocJarPath?: string
}

export type CdmJavaApiIndex = {
  manifest: CdmJavaApiManifest
  classes: CdmJavaClassIndexEntry[]
  promptSeedClasses: string[]
}

export type CdmJavaApiPack = {
  manifest: CdmJavaApiManifest
  index: CdmJavaApiIndex
  classDetails: CdmJavaClassDetails[]
  missingClassObservations: CdmJavaMissingClassObservation[]
}

export type CdmJavaClassLookupResult =
  | {
      status: 'found'
      details: CdmJavaClassDetails
      source: 'cache' | 'javap'
    }
  | {
      status: 'missing'
      className: string
      sameSimpleNameCandidates: string[]
    }

type CdmJavaApiIndexDisk = {
  manifest: CdmJavaApiManifest
  classes: CdmJavaClassIndexEntry[]
  promptSeedClasses?: string[]
  allowedClasses?: string[]
}

type CommandResult = {
  exitCode: number
  stdout: string
  stderr: string
}

export const CDM_JAVA_API_PACK_DIR = 'data/cdm-java-api'

export const FX_SINGLE_LEG_CDM_API_SEED = [
  'cdm.event.common.Trade',
  'cdm.event.common.TradeState',
  'cdm.event.common.TradeIdentifier',
  'cdm.product.template.TradableProduct',
  'cdm.product.template.TradeLot',
  'cdm.product.template.Product',
  'cdm.product.template.NonTransferableProduct',
  'cdm.product.template.EconomicTerms',
  'cdm.product.template.Payout',
  'cdm.base.staticdata.party.Party',
  'cdm.base.staticdata.party.PartyRole',
  'cdm.base.staticdata.party.Counterparty',
  'cdm.base.staticdata.party.CounterpartyRoleEnum',
  'cdm.base.staticdata.party.AncillaryParty',
  'cdm.base.staticdata.party.Account',
  'cdm.base.staticdata.asset.common.ProductIdentifier',
  'cdm.base.staticdata.asset.common.ProductTaxonomy',
  'cdm.base.staticdata.identifier.Identifier',
  'cdm.base.staticdata.identifier.AssignedIdentifier',
  'cdm.observable.asset.PriceQuantity',
  'cdm.observable.asset.Observable',
  'cdm.base.math.NonNegativeQuantitySchedule',
  'cdm.base.math.NonNegativeQuantity',
  'cdm.base.math.UnitType',
  'com.rosetta.model.metafields.FieldWithMetaDate',
  'com.rosetta.model.metafields.MetaFields',
  'com.rosetta.model.lib.records.Date',
]

export const CDM_JAVA_MISSING_CLASS_PROBES = [
  'cdm.product.common.settlement.SettlementPayout',
  'cdm.product.template.SettlementTerms',
  'cdm.product.template.CashSettlementTerms',
  'cdm.product.template.SettlementTypeEnum',
  'cdm.observable.asset.ResolvablePriceQuantity',
  'cdm.base.staticdata.party.PartyReference',
  'cdm.base.staticdata.asset.Asset',
  'cdm.base.staticdata.asset.Cash',
  'cdm.base.math.PriceSchedule',
  'cdm.base.math.PriceTypeEnum',
  'FpmlFxSingleLeg',
]

export function cdmJavaApiPackRoot(version = CDM_JAVA_VERSION): string {
  return resolve(CDM_JAVA_API_PACK_DIR, version)
}

export function cdmJavaApiManifestPath(version = CDM_JAVA_VERSION): string {
  return resolve(cdmJavaApiPackRoot(version), 'manifest.json')
}

export function cdmJavaApiIndexPath(version = CDM_JAVA_VERSION): string {
  return resolve(cdmJavaApiPackRoot(version), 'api-index.json')
}

export function cdmJavaApiPackMarkdownPath(version = CDM_JAVA_VERSION): string {
  return resolve(cdmJavaApiPackRoot(version), 'api-pack.md')
}

export function cdmJavaFxSingleLegPackMarkdownPath(version = CDM_JAVA_VERSION): string {
  return resolve(cdmJavaApiPackRoot(version), 'fx-single-leg-pack.md')
}

export function cdmJavaMissingClassesPath(version = CDM_JAVA_VERSION): string {
  return resolve(cdmJavaApiPackRoot(version), 'missing-classes.json')
}

function legacyCdmJavaNegativeClassesPath(version = CDM_JAVA_VERSION): string {
  return resolve(cdmJavaApiPackRoot(version), 'negative-classes.json')
}

export function cdmJavaApiSummaryMarkdownPath(version = CDM_JAVA_VERSION): string {
  return resolve(cdmJavaApiPackRoot(version), 'api-summary.md')
}

export function cdmJavaClassDetailsPath(className: string, version = CDM_JAVA_VERSION): string {
  return resolve(cdmJavaApiPackRoot(version), 'class-details', `${className}.json`)
}

export function resolveCdmJavaArtifacts(version = CDM_JAVA_VERSION): CdmJavaArtifactPaths {
  const home = process.env.USERPROFILE ?? process.env.HOME ?? ''
  const base = join(home, '.m2', 'repository', 'org', 'finos', 'cdm', 'cdm-java', version)
  const sourcesJarPath = join(base, `cdm-java-${version}-sources.jar`)
  const javadocJarPath = join(base, `cdm-java-${version}-javadoc.jar`)
  return {
    jarPath: join(base, `cdm-java-${version}.jar`),
    sourcesJarPath,
    javadocJarPath,
  }
}

export async function buildCdmJavaApiPack(version = CDM_JAVA_VERSION): Promise<CdmJavaApiPack> {
  if (version !== CDM_JAVA_VERSION) {
    throw new Error(`CDM Java API pack version ${version} does not match repo contract ${CDM_JAVA_VERSION}.`)
  }
  const artifacts = resolveCdmJavaArtifacts(version)
  if (!(await exists(artifacts.jarPath))) {
    throw new Error(
      `Missing ${artifacts.jarPath}\nRun mvn -q dependency:get -Dartifact=org.finos.cdm:cdm-java:${version}`
    )
  }
  const classIndex = await listJavaClasses(artifacts.jarPath)
  const classNames = new Set(classIndex.map(entry => entry.className))
  const promptSeedClasses = FX_SINGLE_LEG_CDM_API_SEED.filter(className => classNames.has(className))
  const missingSeed = FX_SINGLE_LEG_CDM_API_SEED.filter(className => !classNames.has(className))
  const missingClassObservations = buildMissingClassObservations(classNames, missingSeed)
  const manifest = await buildManifest(version, artifacts)
  const details: CdmJavaClassDetails[] = []
  for (const className of promptSeedClasses) {
    details.push(await inspectClassDetails({ jarPath: artifacts.jarPath, className }))
  }
  const index: CdmJavaApiIndex = {
    manifest,
    classes: classIndex,
    promptSeedClasses,
  }
  const pack: CdmJavaApiPack = {
    manifest,
    index,
    classDetails: details,
    missingClassObservations,
  }
  await writeCdmJavaApiPack(pack)
  return pack
}

export async function readCdmJavaApiIndex(version = CDM_JAVA_VERSION): Promise<CdmJavaApiIndex> {
  const disk = JSON.parse(await readFile(cdmJavaApiIndexPath(version), 'utf8')) as CdmJavaApiIndexDisk
  return normalizeCdmJavaApiIndex(disk)
}

export async function readCdmJavaMissingClassObservations(
  version = CDM_JAVA_VERSION
): Promise<CdmJavaMissingClassObservation[]> {
  const path = (await exists(cdmJavaMissingClassesPath(version)))
    ? cdmJavaMissingClassesPath(version)
    : legacyCdmJavaNegativeClassesPath(version)
  const items = JSON.parse(await readFile(path, 'utf8')) as CdmJavaMissingClassObservation[]
  const index = await readCdmJavaApiIndex(version)
  const classNames = new Set(index.classes.map(entry => entry.className))
  return items
    .filter(item => !classNames.has(item.className))
    .map(item => ({
      className: item.className,
      exists: false,
      reason: item.reason.replace(/^not found/u, 'exact class not found'),
      sameSimpleNameCandidates: item.sameSimpleNameCandidates ?? sameSimpleNameCandidates(classNames, item.className),
      authority: 'compiled-jar-javap',
    }))
}

export async function readCdmJavaClassDetails(
  className: string,
  version = CDM_JAVA_VERSION
): Promise<CdmJavaClassDetails | null> {
  const path = cdmJavaClassDetailsPath(className, version)
  if (!(await exists(path))) return null
  return JSON.parse(await readFile(path, 'utf8')) as CdmJavaClassDetails
}

export async function renderCdmJavaApiPackMarkdownFromDisk(version = CDM_JAVA_VERSION): Promise<string> {
  return readFile(cdmJavaFxSingleLegPackMarkdownPath(version), 'utf8')
}

export async function renderCdmJavaMissingClassesMarkdownFromDisk(version = CDM_JAVA_VERSION): Promise<string> {
  const observations = await readCdmJavaMissingClassObservations(version)
  return `# CDM Java Missing-Class Observations

Artifact: org.finos.cdm:cdm-java:${version}
Authority: compiled-jar-javap

These observations apply only to exact fully qualified class names. Do not generalize by simple name.

${observations.map(renderMissingClassObservation).join('\n')}
`
}

export async function renderCdmJavaApiSummaryMarkdownFromDisk(version = CDM_JAVA_VERSION): Promise<string> {
  return readFile(cdmJavaApiSummaryMarkdownPath(version), 'utf8')
}

export async function ensureCdmJavaApiPack(version = CDM_JAVA_VERSION): Promise<CdmJavaApiPack> {
  if (await exists(cdmJavaApiIndexPath(version))) {
    const manifest = JSON.parse(await readFile(cdmJavaApiManifestPath(version), 'utf8')) as CdmJavaApiManifest
    if (manifest.version !== CDM_JAVA_VERSION) {
      throw new Error(`CDM Java API pack version ${manifest.version} does not match ${CDM_JAVA_VERSION}.`)
    }
    const index = await readCdmJavaApiIndex(version)
    const missingClassObservations = await readCdmJavaMissingClassObservations(version)
    const classDetails: CdmJavaClassDetails[] = []
    for (const className of index.promptSeedClasses) {
      const details = await readCdmJavaClassDetails(className, version)
      if (details !== null) classDetails.push(details)
    }
    const pack: CdmJavaApiPack = { manifest, index, missingClassObservations, classDetails }
    if (!(await exists(cdmJavaApiSummaryMarkdownPath(version)))) {
      await writeFile(cdmJavaApiSummaryMarkdownPath(version), renderCdmJavaApiSummaryMarkdown(pack), 'utf8')
    }
    if (!(await exists(cdmJavaMissingClassesPath(version)))) {
      await writeFile(cdmJavaMissingClassesPath(version), JSON.stringify(missingClassObservations, null, 2), 'utf8')
    }
    return pack
  }
  return buildCdmJavaApiPack(version)
}

export function renderCdmJavaApiPackMarkdown(pack: CdmJavaApiPack): string {
  const missingSeeds = FX_SINGLE_LEG_CDM_API_SEED.filter(
    className => !pack.index.promptSeedClasses.includes(className)
  )
  return `# CDM Java API Pack

Artifact: ${pack.manifest.groupId}:${pack.manifest.artifactId}:${pack.manifest.version}
Authority: compiled-jar-javap
Javadocs: ${pack.manifest.javadocUrl}
Maven directory: ${pack.manifest.mavenDirectory}

## Rules

- The compiled CDM Java jar inspected by javap is the only source of truth.
- Classes listed here are prompt seed classes, not the complete jar inventory.
- Use only builder methods listed under the class.
- Use get_cdm_java_class for exact class and builder details not shown here.
- Do not infer CDM Java packages from Rosetta function names or JSON paths.
- CDM Java does not provide FpML input model classes; parse FpML XML with DOM/StAX or generated internal DTOs.

## Prompt Seed Classes

${pack.classDetails.map(renderClassDetails).join('\n\n')}

## Missing Seed Classes

${missingSeeds.length === 0 ? '- none' : missingSeeds.map(className => `- ${className}`).join('\n')}

## Exact Missing-Class Observations

${pack.missingClassObservations.map(renderMissingClassObservation).join('\n')}
`
}

export function renderCdmJavaApiIndexMarkdown(pack: CdmJavaApiPack): string {
  return `# CDM Java API Index

Artifact: ${pack.manifest.groupId}:${pack.manifest.artifactId}:${pack.manifest.version}
Total classes: ${pack.index.classes.length}
Prompt seed classes: ${pack.index.promptSeedClasses.length}

## Prompt Seed Classes

${pack.index.promptSeedClasses.map(className => `- ${className}`).join('\n')}
`
}

export function renderCdmJavaApiSummaryMarkdown(pack: CdmJavaApiPack): string {
  return `# CDM Java API Summary

Artifact: ${pack.manifest.groupId}:${pack.manifest.artifactId}:${pack.manifest.version}
Authority: compiled-jar-javap
Total indexed classes: ${pack.index.classes.length}

## Rules

- This summary is an index, not method authority.
- The compiled CDM Java jar inspected by javap is the only source of truth.
- Before using any CDM class builder, call get_cdm_java_class with the exact fully qualified class name.
- Missing-class results apply only to the exact package queried.
- Do not infer a class is missing from a same-simple-name class in another package.

## Prompt Seed Classes

${pack.index.promptSeedClasses.map(className => `- ${className}`).join('\n')}

## Exact Missing-Class Observations

${pack.missingClassObservations.map(renderMissingClassObservation).join('\n')}
`
}

export async function writeCdmJavaApiPack(pack: CdmJavaApiPack): Promise<void> {
  const root = cdmJavaApiPackRoot(pack.manifest.version)
  await mkdir(resolve(root, 'class-details'), { recursive: true })
  await mkdir(resolve(root, 'source-snippets'), { recursive: true })
  await writeFile(cdmJavaApiManifestPath(pack.manifest.version), JSON.stringify(pack.manifest, null, 2), 'utf8')
  await writeFile(cdmJavaApiIndexPath(pack.manifest.version), JSON.stringify(pack.index, null, 2), 'utf8')
  await writeFile(
    cdmJavaMissingClassesPath(pack.manifest.version),
    JSON.stringify(pack.missingClassObservations, null, 2),
    'utf8'
  )
  await writeFile(cdmJavaApiPackMarkdownPath(pack.manifest.version), renderCdmJavaApiIndexMarkdown(pack), 'utf8')
  await writeFile(cdmJavaFxSingleLegPackMarkdownPath(pack.manifest.version), renderCdmJavaApiPackMarkdown(pack), 'utf8')
  await writeFile(cdmJavaApiSummaryMarkdownPath(pack.manifest.version), renderCdmJavaApiSummaryMarkdown(pack), 'utf8')
  for (const detail of pack.classDetails) {
    await writeCdmJavaClassDetails(detail, pack.manifest.version)
  }
}

export async function writeCdmJavaClassDetails(
  detail: CdmJavaClassDetails,
  version = CDM_JAVA_VERSION
): Promise<void> {
  const path = cdmJavaClassDetailsPath(detail.className, version)
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, JSON.stringify(detail, null, 2), 'utf8')
  await writeFile(
    resolve(cdmJavaApiPackRoot(version), 'source-snippets', `${detail.className}.md`),
    renderClassDetails(detail),
    'utf8'
  )
}

export async function lookupCdmJavaClassDetails(
  className: string,
  version = CDM_JAVA_VERSION
): Promise<CdmJavaClassLookupResult> {
  const cached = await readCdmJavaClassDetails(className, version)
  if (cached !== null) {
    return { status: 'found', details: cached, source: 'cache' }
  }

  const index = await readCdmJavaApiIndex(version)
  const indexed = index.classes.find(entry => entry.className === className)
  if (indexed === undefined) {
    const classNames = new Set(index.classes.map(entry => entry.className))
    return {
      status: 'missing',
      className,
      sameSimpleNameCandidates: sameSimpleNameCandidates(classNames, className),
    }
  }

  const artifacts = resolveCdmJavaArtifacts(version)
  const details = await inspectClassDetails({ jarPath: artifacts.jarPath, className })
  await writeCdmJavaClassDetails(details, version)
  return { status: 'found', details, source: 'javap' }
}

export async function listJavaClasses(jarPath: string): Promise<CdmJavaClassIndexEntry[]> {
  const result = await runCommand(['jar', 'tf', jarPath])
  if (result.exitCode !== 0) throw new Error(result.stderr)
  return result.stdout
    .split(/\r?\n/u)
    .filter(path => path.endsWith('.class'))
    .filter(path => !path.includes('$'))
    .filter(path => path.startsWith('cdm/') || path.startsWith('com/rosetta/'))
    .map(path => {
      const className = path.replace(/\.class$/u, '').replace(/\//gu, '.')
      const parts = className.split('.')
      const simpleName = parts.at(-1) ?? className
      return {
        className,
        packageName: parts.slice(0, -1).join('.'),
        simpleName,
        classFile: path,
      }
    })
    .sort((left, right) => left.className.localeCompare(right.className))
}

export async function inspectClassDetails(args: {
  jarPath: string
  className: string
}): Promise<CdmJavaClassDetails> {
  const classOutput = await javap(args.jarPath, args.className)
  const simpleName = args.className.split('.').at(-1) ?? args.className
  const packageName = args.className.split('.').slice(0, -1).join('.')
  const builderClassName = `${args.className}$${simpleName}Builder`
  const builderOutput = await javap(args.jarPath, builderClassName)
  const enumValues = parseEnumValues(classOutput, args.className)
  return {
    className: args.className,
    exists: true,
    packageName,
    simpleName,
    methods: parseJavapMethods(classOutput),
    builderClassName: builderOutput.trim() === '' ? undefined : builderClassName,
    builderMethods: builderOutput.trim() === '' ? [] : parseJavapMethods(builderOutput),
    enumValues: enumValues.length === 0 ? undefined : enumValues,
  }
}

export function parseJavapMethods(output: string): CdmJavaMethodSignature[] {
  return output
    .split(/\r?\n/u)
    .map(line => line.trim())
    .filter(line => line.startsWith('public '))
    .filter(line => line.endsWith(';'))
    .map(line => line.replace(/;$/u, ''))
    .map(parseMethodLine)
    .filter((method): method is CdmJavaMethodSignature => method !== null)
}

async function buildManifest(version: string, artifacts: CdmJavaArtifactPaths): Promise<CdmJavaApiManifest> {
  const sourcesJarPath = artifacts.sourcesJarPath !== undefined && (await exists(artifacts.sourcesJarPath))
    ? artifacts.sourcesJarPath
    : undefined
  const javadocJarPath = artifacts.javadocJarPath !== undefined && (await exists(artifacts.javadocJarPath))
    ? artifacts.javadocJarPath
    : undefined
  return {
    groupId: 'org.finos.cdm',
    artifactId: 'cdm-java',
    version,
    mavenDirectory: `https://repo1.maven.org/maven2/org/finos/cdm/cdm-java/${version}/`,
    javadocUrl: `https://javadoc.io/doc/org.finos.cdm/cdm-java/${version}/`,
    generatedAt: new Date().toISOString(),
    jarPath: artifacts.jarPath,
    sourcesJarPath,
    javadocJarPath,
  }
}

function buildMissingClassObservations(
  classNames: Set<string>,
  missingSeedClasses: string[]
): CdmJavaMissingClassObservation[] {
  const items: CdmJavaMissingClassObservation[] = []
  for (const className of CDM_JAVA_MISSING_CLASS_PROBES) {
    if (classNames.has(className)) continue
    items.push({
      className,
      exists: false,
      reason: className.startsWith('Fpml')
        ? 'not part of CDM Java; use XML parser DTOs or DOM/StAX parsing'
        : `exact class not found in cdm-java-${CDM_JAVA_VERSION}.jar`,
      sameSimpleNameCandidates: sameSimpleNameCandidates(classNames, className),
      authority: 'compiled-jar-javap',
    })
  }
  for (const className of missingSeedClasses) {
    if (items.some(item => item.className === className)) continue
    items.push({
      className,
      exists: false,
      reason: `prompt seed class not found in cdm-java-${CDM_JAVA_VERSION}.jar`,
      sameSimpleNameCandidates: sameSimpleNameCandidates(classNames, className),
      authority: 'compiled-jar-javap',
    })
  }
  return items.sort((left, right) => left.className.localeCompare(right.className))
}

function sameSimpleNameCandidates(classNames: Set<string>, className: string): string[] {
  const simpleName = className.split('.').at(-1) ?? className
  return [...classNames]
    .filter(candidate => candidate !== className)
    .filter(candidate => candidate.split('.').at(-1) === simpleName)
    .sort()
}

function normalizeCdmJavaApiIndex(index: CdmJavaApiIndexDisk): CdmJavaApiIndex {
  return {
    manifest: index.manifest,
    classes: index.classes,
    promptSeedClasses: index.promptSeedClasses ?? index.allowedClasses ?? [],
  }
}

function renderMissingClassObservation(item: CdmJavaMissingClassObservation): string {
  const candidates = item.sameSimpleNameCandidates?.length
    ? `\n  Same simple-name candidates in jar:\n${item.sameSimpleNameCandidates.map(candidate => `  - ${candidate}`).join('\n')}`
    : ''
  return `- ${item.className}: ${item.reason}${candidates}`
}

function parseMethodLine(raw: string): CdmJavaMethodSignature | null {
  const match = /^public\s+(?:abstract\s+|static\s+|default\s+|final\s+)*(.+?)\s+([A-Za-z_$][A-Za-z0-9_$]*)\((.*)\)$/u.exec(raw)
  if (match === null) return null
  const returnType = match[1]
  const name = match[2]
  const params = match[3]
  if (returnType === undefined || name === undefined || params === undefined) return null
  return {
    name,
    returnType,
    parameters: params.trim() === '' ? [] : params.split(',').map(param => param.trim()),
    raw,
  }
}

function parseEnumValues(output: string, className: string): string[] {
  const escapedClassName = className.replace(/\./gu, '\\.')
  const pattern = new RegExp(`public static final ${escapedClassName}\\.([A-Z][A-Z0-9_]*);`, 'u')
  const values: string[] = []
  for (const line of output.split(/\r?\n/u)) {
    const match = pattern.exec(line.trim())
    const value = match?.[1]
    if (value !== undefined) values.push(value)
  }
  return values
}

async function javap(jarPath: string, className: string): Promise<string> {
  const result = await runCommand(['javap', '-classpath', jarPath, '-public', className])
  if (result.exitCode !== 0 && result.stdout.trim() === '') return ''
  return truncateForLog(result.stdout, 80_000)
}

async function runCommand(command: string[]): Promise<CommandResult> {
  const proc = Bun.spawn(command, {
    stdout: 'pipe',
    stderr: 'pipe',
  })
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ])
  return { stdout, stderr, exitCode }
}

function renderClassDetails(detail: CdmJavaClassDetails): string {
  return `## Class: ${detail.className}

Exists: yes
Package: ${detail.packageName}
Builder: ${detail.builderClassName ?? 'none detected'}

### Public Methods

${renderMethods(detail.methods)}

### Builder Methods

${renderMethods(detail.builderMethods)}
${detail.enumValues === undefined ? '' : `
### Enum Values

${detail.enumValues.map(value => `- ${value}`).join('\n')}
`}
`
}

function renderMethods(methods: CdmJavaMethodSignature[]): string {
  if (methods.length === 0) return '- none'
  return methods
    .filter(method => isUsefulMethod(method.name))
    .slice(0, 80)
    .map(method => `\`\`\`java\n${method.raw}\n\`\`\``)
    .join('\n')
}

function isUsefulMethod(name: string): boolean {
  return name.startsWith('get')
    || name.startsWith('set')
    || name.startsWith('add')
    || name.startsWith('build')
    || name.startsWith('toBuilder')
    || name.startsWith('builder')
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}
