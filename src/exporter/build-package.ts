import type {
  RosettaMappingPackage,
  ExportCoverage,
  ExportAuditSnapshot,
  RosettaDocumentHeader,
} from './types'
import { ROSETTA_PACKAGE_VERSION } from './types'
import type { ApprovedMappingExportRow, SkippedProposalRow } from '../storage/queries'

export function buildRosettaPackage(args: {
  document: RosettaDocumentHeader
  totalProposalCount: number
  approved: ApprovedMappingExportRow[]
  skipped: SkippedProposalRow[]
  audit: Omit<ExportAuditSnapshot, 'counts'>
}): RosettaMappingPackage {
  const mappings = args.approved.map(r => ({
    source: {
      path: r.fieldPath,
      name: r.fieldName,
      value: r.fieldValue ?? undefined,
    },
    target: { cdmPath: r.cdmPath, transformation: r.transformation },
    evidence: {
      skillInvoked: r.skillInvoked,
      confidence: r.confidence,
      proposalId: r.proposalId,
      approvedBy: r.approvedBy,
      approvedAt: r.approvedAt,
    },
  }))

  const coverage: ExportCoverage = {
    totalProposals: args.totalProposalCount,
    exportedCount: args.approved.length,
    skipped: args.skipped.map(s => ({
      proposalId: s.proposalId,
      sourcePath: s.fieldPath,
      sourceName: s.fieldName,
      status: s.status as 'pending' | 'rejected' | 'edited',
      reason:
        s.status === 'rejected'
          ? 'rejected'
          : s.status === 'edited'
            ? 'awaiting_approval'
            : 'pending',
    })),
  }

  return {
    version: ROSETTA_PACKAGE_VERSION,
    document: args.document,
    mappings,
    coverage,
    audit: {
      ...args.audit,
      counts: { mappings: mappings.length, skipped: coverage.skipped.length },
    },
  }
}
