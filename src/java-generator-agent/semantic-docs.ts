export type DocumentationAuthority =
  | 'compiled-jar-javap'
  | 'source-jar'
  | 'javadoc-jar'
  | 'rosetta-source'
  | 'cookbook'
  | 'generated-recipe'
  | 'runtime-fixture'

export type SemanticClassDoc = {
  className: string
  authority: DocumentationAuthority
  description?: string
  fieldSemantics: SemanticFieldDoc[]
  constructionNotes: string[]
  relatedRosettaFunctions: string[]
}

export type SemanticFieldDoc = {
  fieldName: string
  meaning: string
  source: DocumentationAuthority
}

export function renderAuthorities(authorities: DocumentationAuthority[]): string {
  return authorities.join(', ')
}
