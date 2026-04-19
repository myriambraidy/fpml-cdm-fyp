export interface RosettaMappingEntry {
  source: { path: string; name: string; value?: string }
  target: { cdmPath: string; transformation: string }
  evidence: {
    skillInvoked: string
    confidence: number
    proposalId: string
    approvedBy: string
    approvedAt: string
  }
}

export interface SkippedField {
  proposalId: string
  sourcePath: string
  sourceName: string
  status: 'pending' | 'rejected' | 'edited'
  reason: string
}

export interface ExportCoverage {
  totalProposals: number
  exportedCount: number
  skipped: SkippedField[]
}

export interface ExportAuditSnapshot {
  exportedAt: string
  exportedBy: string
  cdmVersion: string
  skillVersions: Record<string, string>
  uploadId: string
  filename?: string
  counts: { mappings: number; skipped: number }
}

export interface RosettaDocumentHeader {
  uploadId: string
  filename: string
  formatType: 'xml' | 'json'
}

export const ROSETTA_PACKAGE_VERSION = '1.0.0-prototype' as const

export interface RosettaMappingPackage {
  version: typeof ROSETTA_PACKAGE_VERSION
  document: RosettaDocumentHeader
  mappings: RosettaMappingEntry[]
  coverage: ExportCoverage
  audit: ExportAuditSnapshot
}
