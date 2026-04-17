// Parser type definitions
// Generation date: 2026-04-17

/**
 * Normalized field representation
 * Output format from XML/JSON parsers
 */
export interface Field {
  name: string                    // Field name (e.g., "buyer")
  path: string                    // XPath or JSON path (e.g., "/trade/buyer")
  value?: string                  // Field value if present
  type?: string                   // Field type from schema (e.g., "xsd:string", "Party")
  context?: Record<string, any>   // Additional metadata (parent element, siblings, etc.)

  // Schema metadata (if available)
  minOccurs?: number
  maxOccurs?: number | 'unbounded'
  isArray?: boolean               // Parser detected array structure
}

/**
 * Parsed document result
 */
export interface ParsedDocument {
  fields: Field[]
  formatType: 'xml' | 'json'
  rootElement?: string
  namespace?: string
}
