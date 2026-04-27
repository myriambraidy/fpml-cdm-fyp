import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { LLMClient, LLMResponse } from '../../src/agent/types'
import type {
  CookbookEvidenceSidecar,
  CookbookManifest,
} from '../../src/cookbook/types'
import type {
  AuthoredCookbookPage,
  CookbookEvidencePacket,
  CookbookLlmConfig,
  CriticReport,
  EvidenceAuditReport,
  StopJudgeReport,
} from '../../src/cookbook-llm/types'

export class QueueLlmClient implements LLMClient {
  private readonly responses: string[]
  readonly models: string[] = []

  constructor(responses: string[]) {
    this.responses = [...responses]
  }

  async call(params: Parameters<LLMClient['call']>[0]): Promise<LLMResponse> {
    this.models.push(params.model ?? 'default')
    const content = this.responses.shift()
    if (!content) {
      throw new Error('No queued LLM response.')
    }
    return { content }
  }
}

export function jsonResponse(value: object): string {
  return JSON.stringify(value)
}

export function authoredPage(evidenceId = 'index:DETERMINISTIC'): AuthoredCookbookPage {
  return {
    markdown: [
      '# FPML -> CDM Agent Cookbook',
      '',
      '## How To Use This Cookbook',
      'Use the evidence-backed cookbook to propose CDM mappings.',
      '',
      '## Operational Statuses',
      'Respect ready, pilot_only, review_only, and blocked status.',
      '',
      '## Product Family Routing',
      'Route by product family.',
      '',
      '## Proposed CDM Representation Format',
      'Return field mappings with evidence rule ids.',
      '',
      '## Universal Do Not Assume',
      'Do not invent mapping facts.',
    ].join('\n'),
    claims: [
      {
        claim: 'The cookbook must preserve evidence-backed routing and proposal structure.',
        evidenceIds: [evidenceId],
        confidence: 'high',
        requiresHumanReview: false,
      },
    ],
    unresolvedQuestions: [],
    doNotAssume: ['Do not invent mapping facts.'],
  }
}

export function passCritic(): CriticReport {
  return {
    decision: 'pass',
    score: 95,
    blockingIssues: [],
    nonBlockingSuggestions: [],
  }
}

export function passAudit(claim: string): EvidenceAuditReport {
  return {
    decision: 'pass',
    auditedClaims: [
      {
        claim,
        support: 'supported',
        evidenceIds: ['index:DETERMINISTIC'],
        reason: 'The deterministic evidence supports the claim.',
      },
    ],
    unsupportedClaims: [],
    overgeneralizedClaims: [],
    missingEvidence: [],
  }
}

export function passJudge(): StopJudgeReport {
  return {
    decision: 'pass',
    reason: 'The page is grounded and operational.',
    scores: {
      grounding: 5,
      actionability: 5,
      exceptionHandling: 5,
      validation: 5,
      agentUsability: 5,
    },
  }
}

export function repairJudge(): StopJudgeReport {
  return {
    decision: 'repair_required',
    reason: 'Repair the page.',
    scores: {
      grounding: 3,
      actionability: 3,
      exceptionHandling: 3,
      validation: 3,
      agentUsability: 3,
    },
  }
}

export function makePacket(): CookbookEvidencePacket {
  return {
    id: 'index',
    subjectType: 'index',
    title: 'FPML -> CDM Agent Cookbook',
    operationalStatus: 'ready',
    deterministicMarkdown: authoredPage().markdown,
    evidenceReferences: [
      {
        id: 'index:DETERMINISTIC',
        source: 'index.md',
        kind: 'deterministic',
        text: authoredPage().markdown,
      },
    ],
    requiredSections: [
      'How To Use This Cookbook',
      'Operational Statuses',
      'Product Family Routing',
      'Proposed CDM Representation Format',
      'Universal Do Not Assume',
    ],
    allowedClaimsPolicy: ['Use deterministic evidence.'],
  }
}

export function makeConfig(tempDir: string): CookbookLlmConfig {
  return {
    workspaceRoot: tempDir,
    deterministicRoot: join(tempDir, 'deterministic'),
    draftsRoot: join(tempDir, 'drafts'),
    outputRoot: join(tempDir, 'agent-cookbook-llm'),
    mode: 'overwrite',
    maxRepairLoops: 2,
    includeReviewOnly: true,
    storeRawResponses: true,
    failFast: false,
    logLevel: 'silent',
    onlyPacketId: 'index',
    models: {
      author: 'author-model',
      critic: 'critic-model',
      auditor: 'auditor-model',
      repair: 'repair-model',
      judge: 'judge-model',
    },
    temperatures: {
      author: 0.2,
      critic: 0,
      auditor: 0,
      repair: 0.1,
      judge: 0,
    },
  }
}

export async function writeDeterministicFixture(root: string): Promise<void> {
  await mkdir(root, { recursive: true })
  await mkdir(join(root, 'global'), { recursive: true })
  await mkdir(join(root, 'product-families'), { recursive: true })
  await mkdir(join(root, 'references'), { recursive: true })

  const manifest: CookbookManifest = {
    generatedAt: '2026-04-26T00:00:00.000Z',
    mode: 'overwrite',
    sourceDraftRoot: 'data/drafts',
    outputRoot: root,
    families: [
      {
        folder: 'fx-derivatives',
        operationalStatus: 'ready',
        confidenceSummary: {
          high: 1,
          medium: 0,
          low: 0,
          blocked: 0,
        },
        markdownPath: 'product-families/fx-derivatives.md',
        evidencePath: 'references/fx-derivatives.evidence.json',
        draftPath: 'data/drafts/fx-derivatives/draft.json',
      },
    ],
    globalDocuments: [
      {
        name: 'identifier-handling',
        markdownPath: 'global/identifier-handling.md',
        ruleCount: 1,
      },
    ],
  }

  const sidecar: CookbookEvidenceSidecar = {
    folder: 'fx-derivatives',
    generatedAt: manifest.generatedAt,
    sourceDraft: 'data/drafts/fx-derivatives/draft.json',
    evidenceCoverage: {
      matchedPairCount: 1,
      structuralPairCount: 1,
      semanticPairCount: 1,
      fullSemanticPairCount: 1,
      salvagedSemanticPairCount: 0,
      failedSemanticPairCount: 0,
      structuralBasisNote: 'One structural pair.',
      semanticBasisNote: 'One semantic pair.',
    },
    stableMappingPatterns: [
      {
        id: 'RULE-001',
        name: 'Trade identifier preservation',
        strength: 'strong recurring pattern',
        evidenceCount: 1,
        sourcePattern: 'tradeHeader.partyTradeIdentifier.tradeId',
        targetPattern: 'trade.tradeIdentifier.assignedIdentifier.identifier.value',
        explanation: 'Copy trade identifiers.',
        whyItWorksThisWay: 'Traceability.',
        exampleFiles: ['fx-derivatives/ex01.xml'],
        caveats: [],
      },
    ],
    repeatedNonLiteralTransformations: [],
    tentativeRepeatedPatterns: [],
    variantsAndExceptions: [],
    suspectedEnrichmentOrDefaultBehavior: [],
    openQuestions: [],
  }

  await writeFile(join(root, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8')
  await writeFile(join(root, 'index.md'), authoredPage().markdown, 'utf8')
  await writeFile(join(root, 'global', 'identifier-handling.md'), authoredPage('global:identifier-handling:DETERMINISTIC').markdown, 'utf8')
  await writeFile(join(root, 'product-families', 'fx-derivatives.md'), authoredPage('fx-derivatives:RULE-001').markdown, 'utf8')
  await writeFile(join(root, 'references', 'fx-derivatives.evidence.json'), JSON.stringify(sidecar, null, 2), 'utf8')
}
