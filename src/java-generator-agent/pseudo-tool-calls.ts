export type PseudoToolCallFinding = {
  toolName: string
  category: 'bracket_block' | 'function_like' | 'xml_like' | 'arrow_object'
  excerpt: string
}

const TOOL_NAMES = [
  'read_file',
  'list_files',
  'search_text',
  'parse_xml_summary',
  'parse_json_summary',
  'write_file',
  'write_generated_java',
  'write_generated_java_file',
  'run_command',
  'validate_generated_output',
  'get_scope_evidence',
  'get_context_packet',
  'get_fixture_summary',
  'get_expected_cdm_summary',
  'get_rosetta_snippet',
  'get_rosetta_function',
  'get_rosetta_functions',
  'search_rosetta_blocks',
  'get_rosetta_mapping_area',
  'get_rosetta_generation_context',
  'get_rosetta_call_graph',
  'get_cdm_java_class',
  'search_cdm_java_classes',
  'resolve_cdm_concept',
  'get_cdm_builder_methods',
  'get_related_cdm_classes',
  'get_approved_cdm_api_contract',
  'get_cdm_semantic_recipe',
  'get_cdm_java_missing_classes',
  'get_unsupported_products',
]

export function detectPseudoToolCalls(text: string): PseudoToolCallFinding[] {
  const findings: PseudoToolCallFinding[] = []
  const seen = new Set<string>()
  for (const toolName of TOOL_NAMES) {
    const patterns: Array<[PseudoToolCallFinding['category'], RegExp]> = [
      ['bracket_block', new RegExp(`\\[(?:tool_call|TOOL_CALL|tool_calls_start)[\\s\\S]{0,400}?${toolName}`, 'iu')],
      ['xml_like', new RegExp(`<tool_call[^>]*name=["']${toolName}["']`, 'iu')],
      ['function_like', new RegExp(`\\b${toolName}\\s*\\(`, 'iu')],
      ['arrow_object', new RegExp(`(?:tool|"tool")\\s*(?:=>|:)>?\\s*["']${toolName}["']`, 'iu')],
    ]
    for (const [category, pattern] of patterns) {
      const match = pattern.exec(text)
      if (match?.index === undefined) continue
      const key = `${category}:${toolName}:${match.index}`
      if (seen.has(key)) continue
      seen.add(key)
      findings.push({
        toolName,
        category,
        excerpt: excerptAt(text, match.index),
      })
    }
  }
  return findings
}

function excerptAt(text: string, index: number): string {
  const start = Math.max(0, index - 120)
  const end = Math.min(text.length, index + 240)
  return text.slice(start, end).replace(/\s+/gu, ' ').trim()
}
