import { readdir, readFile, stat } from 'node:fs/promises'
import { basename, join } from 'node:path'

export type FxProductGroup =
  | 'fx-single-leg'
  | 'fx-swap'
  | 'fx-simple-option'
  | 'fx-digital-option'
  | 'fx-barrier-option'
  | 'fx-average-rate-option'
  | 'fx-strategy'
  | 'non-fx'
  | 'unknown-fx'

export type ProductImplementationHint = 'good-first-target' | 'candidate' | 'later' | 'exclude'

export type ClassifiedFixture = {
  fpmlPath: string
  expectedCdmPath?: string
  productGroup: FxProductGroup
  detectedFpmlRoot?: string
  productLabel: string
  confidence: 'high' | 'medium' | 'low'
  reason: string
}

export type ProductGroupSummary = {
  label: string
  group: FxProductGroup
  fixtureCount: number
  implementationHint: ProductImplementationHint
  reason: string
}

export type ProductScopeGuidance = {
  productFamily: string
  familyBoundary: 'fx-derivatives'
  implementationStrategy: 'staged-by-product-group'
  currentImplementationGroup: FxProductGroup
  candidateNextGroups: FxProductGroup[]
  classifiedFixtures: ClassifiedFixture[]
  productGroups: ProductGroupSummary[]
  nonFxFixtures: ClassifiedFixture[]
  knownAbsentPaths: string[]
  allowNonFxExpansion: false
}

const FPML_FX_ROOT = 'data_to_learn_from/fpml/fx-derivatives'
const CDM_FX_ROOT = 'data_to_learn_from/cdm_parallel/fx-derivatives'

export async function buildProductScopeGuidance(args: {
  productFamily: string
}): Promise<ProductScopeGuidance> {
  if (args.productFamily !== 'fx-derivatives') {
    throw new Error(`Unsupported Java generator product family: ${args.productFamily}`)
  }

  const fpmlFixtures = await listFixtureFiles(FPML_FX_ROOT)
  const classifiedFixtures = await Promise.all(fpmlFixtures.map(classifyFxFixture))

  return {
    productFamily: 'fx-derivatives',
    familyBoundary: 'fx-derivatives',
    implementationStrategy: 'staged-by-product-group',
    currentImplementationGroup: 'fx-single-leg',
    candidateNextGroups: ['fx-swap', 'fx-simple-option'],
    classifiedFixtures,
    productGroups: summarizeProductGroups(classifiedFixtures),
    nonFxFixtures: classifiedFixtures.filter(fixture => fixture.productGroup === 'non-fx'),
    knownAbsentPaths: [
      'data/agent-cookbook/latest/fx-derivatives',
      'data/agent-cookbook/latest/fx-derivatives/evidence.json',
    ],
    allowNonFxExpansion: false,
  }
}

export async function classifyFxFixture(fpmlPath: string): Promise<ClassifiedFixture> {
  const xml = await readFile(fpmlPath, 'utf8')
  const fileName = basename(fpmlPath)
  const expectedCdmPath = await findExpectedCdmPath(fileName)

  if (xml.includes('<termDeposit')) {
    return classified({
      fpmlPath,
      expectedCdmPath,
      productGroup: 'non-fx',
      detectedFpmlRoot: 'trade/termDeposit',
      productLabel: 'Term deposit',
      confidence: 'high',
      reason: 'Contains <termDeposit>, which is not part of the FX derivatives family.',
    })
  }
  if (xml.includes('<fxSwap') || fileName.includes('fx-swap')) {
    return classified({
      fpmlPath,
      expectedCdmPath,
      productGroup: 'fx-swap',
      detectedFpmlRoot: xml.includes('<fxSwap') ? 'trade/fxSwap' : undefined,
      productLabel: 'FX swap',
      confidence: xml.includes('<fxSwap') ? 'high' : 'medium',
      reason: 'FX swap signal found in XML or filename.',
    })
  }
  if (xml.includes('<strategy') || fileName.includes('straddle') || fileName.includes('delta-hedge')) {
    return classified({
      fpmlPath,
      expectedCdmPath,
      productGroup: 'fx-strategy',
      detectedFpmlRoot: xml.includes('<strategy') ? 'trade/strategy' : undefined,
      productLabel: 'FX strategy',
      confidence: xml.includes('<strategy') ? 'medium' : 'low',
      reason: 'Strategy signal found in XML or filename.',
    })
  }
  if (xml.includes('<fxSingleLeg')) {
    return classified({
      fpmlPath,
      expectedCdmPath,
      productGroup: 'fx-single-leg',
      detectedFpmlRoot: 'trade/fxSingleLeg',
      productLabel: 'FX single-leg',
      confidence: 'high',
      reason: 'Contains <fxSingleLeg>.',
    })
  }
  if (xml.includes('<fxSimpleOption')) {
    return classified({
      fpmlPath,
      expectedCdmPath,
      productGroup: 'fx-simple-option',
      detectedFpmlRoot: 'trade/fxSimpleOption',
      productLabel: 'FX simple option',
      confidence: 'high',
      reason: 'Contains <fxSimpleOption>.',
    })
  }
  if (xml.includes('<fxDigitalOption')) {
    return classified({
      fpmlPath,
      expectedCdmPath,
      productGroup: 'fx-digital-option',
      detectedFpmlRoot: 'trade/fxDigitalOption',
      productLabel: 'FX digital option',
      confidence: 'high',
      reason: 'Contains <fxDigitalOption>.',
    })
  }
  if (xml.includes('<fxBarrierOption') || fileName.includes('barrier')) {
    return classified({
      fpmlPath,
      expectedCdmPath,
      productGroup: 'fx-barrier-option',
      detectedFpmlRoot: xml.includes('<fxBarrierOption') ? 'trade/fxBarrierOption' : undefined,
      productLabel: 'FX barrier option',
      confidence: xml.includes('<fxBarrierOption') ? 'high' : 'medium',
      reason: 'Barrier option signal found in XML or filename.',
    })
  }
  if (fileName.includes('avg-rate')) {
    return classified({
      fpmlPath,
      expectedCdmPath,
      productGroup: 'fx-average-rate-option',
      productLabel: 'FX average-rate option',
      confidence: 'medium',
      reason: 'Average-rate option signal found in filename.',
    })
  }
  return classified({
    fpmlPath,
    expectedCdmPath,
    productGroup: 'unknown-fx',
    productLabel: 'Unknown FX derivative',
    confidence: 'low',
    reason: 'Fixture is in the FX derivatives folder but no known product root was detected.',
  })
}

export function renderProductScopeMarkdown(scope: ProductScopeGuidance): string {
  return `# Product Scope

Selected product family: ${scope.productFamily}
Implementation strategy: ${scope.implementationStrategy}
Default current implementation group: ${scope.currentImplementationGroup}
Candidate next groups: ${scope.candidateNextGroups.join(', ')}

## Product Groups

${scope.productGroups
  .map(
    group =>
      `- ${group.group}: ${group.fixtureCount} fixture(s), ${group.implementationHint}. ${group.reason}`
  )
  .join('\n')}

## Classified Fixtures

${scope.classifiedFixtures
  .map(
    fixture =>
      `- ${fixture.productGroup}: ${fixture.fpmlPath}${fixture.expectedCdmPath ? ` -> ${fixture.expectedCdmPath}` : ''}`
  )
  .join('\n')}

## Rules

- Use this product map instead of discovering product types through broad search.
- Plan within the FX derivatives family.
- Do not add non-FX products to the current plan.
- Do not invent fixture paths, cookbook paths, or product roots.
- If changing the default implementation group, write an "Implementation Group Change Proposal".
`
}

function summarizeProductGroups(classifiedFixtures: ClassifiedFixture[]): ProductGroupSummary[] {
  const groups: FxProductGroup[] = [
    'fx-single-leg',
    'fx-swap',
    'fx-simple-option',
    'fx-digital-option',
    'fx-barrier-option',
    'fx-average-rate-option',
    'fx-strategy',
    'unknown-fx',
    'non-fx',
  ]
  return groups
    .map(group => {
      const fixtureCount = classifiedFixtures.filter(fixture => fixture.productGroup === group).length
      return {
        label: labelForGroup(group),
        group,
        fixtureCount,
        implementationHint: implementationHintForGroup(group),
        reason: reasonForGroup(group),
      }
    })
    .filter(group => group.fixtureCount > 0)
}

function implementationHintForGroup(group: FxProductGroup): ProductImplementationHint {
  if (group === 'fx-single-leg') return 'good-first-target'
  if (group === 'fx-swap' || group === 'fx-simple-option') return 'candidate'
  if (group === 'non-fx') return 'exclude'
  return 'later'
}

function labelForGroup(group: FxProductGroup): string {
  const labels: Record<FxProductGroup, string> = {
    'fx-single-leg': 'FX single-leg',
    'fx-swap': 'FX swap',
    'fx-simple-option': 'FX simple option',
    'fx-digital-option': 'FX digital option',
    'fx-barrier-option': 'FX barrier option',
    'fx-average-rate-option': 'FX average-rate option',
    'fx-strategy': 'FX strategy',
    'non-fx': 'Non-FX fixture',
    'unknown-fx': 'Unknown FX derivative',
  }
  return labels[group]
}

function reasonForGroup(group: FxProductGroup): string {
  const reasons: Record<FxProductGroup, string> = {
    'fx-single-leg': 'Default starting group for staged FX-family generation.',
    'fx-swap': 'Natural next FX group after single-leg handling.',
    'fx-simple-option': 'Candidate after simpler linear FX products are stable.',
    'fx-digital-option': 'Requires richer option handling and should follow simpler options.',
    'fx-barrier-option': 'More complex option variant; later milestone.',
    'fx-average-rate-option': 'More complex option variant; later milestone.',
    'fx-strategy': 'Strategy wrappers need separate decomposition logic.',
    'non-fx': 'Excluded from FX derivatives generation.',
    'unknown-fx': 'Needs human review before implementation.',
  }
  return reasons[group]
}

async function listFixtureFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true })
  return entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.xml'))
    .map(entry => join(root, entry.name))
    .sort()
}

async function findExpectedCdmPath(fpmlFileName: string): Promise<string | undefined> {
  const expected = join(CDM_FX_ROOT, fpmlFileName.replace(/\.xml$/u, '.json'))
  return (await exists(expected)) ? expected : undefined
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

function classified(args: ClassifiedFixture): ClassifiedFixture {
  return args
}
