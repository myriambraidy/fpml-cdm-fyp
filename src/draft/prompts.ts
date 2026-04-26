import type {
  DraftCoverageSummary,
  DraftIgnoredExample,
  DraftPair,
  PairDocumentSummary,
  PairHighlight,
  TentativeRepeatedPattern,
} from './types'

const MAX_DOCUMENT_CHARS = 40_000

const truncate = (raw: string): string => {
  if (raw.length <= MAX_DOCUMENT_CHARS) {
    return raw
  }
  return `${raw.slice(0, MAX_DOCUMENT_CHARS)}\n\n[TRUNCATED AFTER ${MAX_DOCUMENT_CHARS} CHARACTERS]`
}

export function buildPairAnalysisMessages(args: {
  pair: DraftPair
  fpmlRaw: string
  cdmRaw: string
  fpmlSummary: PairDocumentSummary
  cdmSummary: PairDocumentSummary
  retryMode?: boolean
}): Array<{ role: 'system' | 'user'; content: string }> {
  const { pair, fpmlRaw, cdmRaw, fpmlSummary, cdmSummary, retryMode = false } = args
  return [
    {
      role: 'system',
      content: [
        'You are an extraction engine for FPML to CDM mapping evidence.',
        'Extract only supported findings from one paired example.',
        'You are not writing documentation, markdown, narrative analysis, or display labels.',
        'Return only valid JSON that matches the required schema.',
        'Do not include comments.',
        'Do not invent filenames, prior examples, external documentation, or unsupported rules.',
        'Use the exact fpmlRelativePath and cdmRelativePath values provided in the input.',
        'If evidence is weak, return empty arrays instead of guessing.',
        'Every mapping observation must be grounded in source and target evidence present in the input.',
        'If CDM contains information not clearly grounded in FpML, classify it as enriched or unclear.',
        'Prefer short strings over long explanations.',
        retryMode
          ? 'The previous response was malformed or empty. Return a smaller object. Prefer fewer findings over truncation.'
          : '',
      ].join(' '),
    },
    {
      role: 'user',
      content: [
        `Pair identity:`,
        `- folder: ${pair.folder}`,
        `- fpmlRelativePath: ${pair.fpmlRelativePath}`,
        `- cdmRelativePath: ${pair.cdmRelativePath}`,
        `- pairingStrategy: ${pair.pairingStrategy}`,
        ``,
        `Extraction limits:`,
        retryMode
          ? `- extract 2 to 4 concrete mapping observations when supported`
          : `- extract 2 to 4 concrete mapping observations when supported`,
        retryMode
          ? `- extract 0 to 2 non-literal transformations when supported`
          : `- extract 0 to 2 non-literal transformations when supported`,
        retryMode
          ? `- extract 0 to 1 likely enrichments when supported`
          : `- extract 0 to 1 likely enrichments when supported`,
        retryMode
          ? `- extract 0 to 2 open questions when supported`
          : `- extract 0 to 2 open questions when supported`,
        `- if the pair supports fewer findings, return fewer`,
        retryMode ? `- keep every string extremely short` : `- keep every string short`,
        retryMode ? `- keep every note under 12 words when possible` : `- keep every note under 18 words when possible`,
        `- when possible, use exact source and target paths from the deterministic summaries`,
        ``,
        `Deterministic FpML summary:`,
        JSON.stringify(fpmlSummary, null, 2),
        ``,
        `Deterministic CDM summary:`,
        JSON.stringify(cdmSummary, null, 2),
        ``,
        `FpML source document:`,
        truncate(fpmlRaw),
        ``,
        `CDM target document:`,
        truncate(cdmRaw),
        ``,
        `Return only a JSON object that matches the required schema.`,
      ].join('\n'),
    },
  ]
}

export function buildFolderSynthesisMessages(args: {
  folder: string
  coverage: DraftCoverageSummary
  tentativeRepeatedPatterns: TentativeRepeatedPattern[]
  representativeHighlights: PairHighlight[]
  openQuestions: string[]
  includedExamples: string[]
  missingExamples: string[]
  ignoredExamples: DraftIgnoredExample[]
  retryMode?: boolean
}): Array<{ role: 'system' | 'user'; content: string }> {
  const {
    folder,
    coverage,
    tentativeRepeatedPatterns,
    representativeHighlights,
    openQuestions,
    includedExamples,
    missingExamples,
    ignoredExamples,
    retryMode = false,
  } = args

  return [
    {
      role: 'system',
      content: [
        'You are synthesizing accepted pair-level extraction records into folder-level semantic mapping guidance.',
        'Structural coverage, pair highlights, and deterministic repeated-signal summaries are computed separately by the pipeline.',
        'Use only the provided repeated-signal candidates and representative examples for semantic rules, transformations, exceptions, enrichments, and open questions.',
        'Do not invent missing rules, filenames, or external examples.',
        'Do not infer folder-wide rules from a single weak example unless clearly tentative.',
        'If a rule is not supported by repeated evidence, omit it.',
        'Keep each rule concise and evidence-based.',
        'Return only valid JSON matching the required semantic schema.',
        retryMode
          ? 'The previous response was malformed or truncated. Return a smaller semantic summary and prefer omission over truncation.'
          : '',
      ].join(' '),
    },
    {
      role: 'user',
      content: [
        `Folder: ${folder}`,
        ``,
        `Coverage summary:`,
        JSON.stringify(coverage, null, 2),
        ``,
        `Important synthesis rule: structural repetition, pair highlights, and deterministic repeated-signal summaries are handled outside this prompt. Focus only on folder-level semantic guidance.`,
        retryMode
          ? `Return fewer rules if needed. Prefer 1 to 3 strong rules over a larger malformed response.`
          : '',
        ``,
        `Included examples:`,
        JSON.stringify(includedExamples, null, 2),
        ``,
        `Missing examples:`,
        JSON.stringify(missingExamples, null, 2),
        ``,
        `Ignored examples:`,
        JSON.stringify(ignoredExamples, null, 2),
        ``,
        `Deterministic repeated-signal candidates:`,
        JSON.stringify(tentativeRepeatedPatterns, null, 2),
        ``,
        `Representative pair highlights:`,
        JSON.stringify(representativeHighlights, null, 2),
        ``,
        `Representative open questions:`,
        JSON.stringify(openQuestions, null, 2),
        ``,
        `Return only a JSON object containing semantic sections for the folder.`,
      ].join('\n'),
    },
  ]
}
