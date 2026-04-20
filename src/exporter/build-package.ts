import type {
  RosettaMappingPackage,
  ExportCoverage,
  ExportAuditSnapshot,
  RosettaDocumentHeader,
} from './types'
import { ROSETTA_PACKAGE_VERSION } from './types'
import type { ApprovedMappingExportRow, SkippedProposalRow } from '../storage/queries'
import { findMappingCollisions } from '../diagnostics/mapping-collisions'
import type { CoverageFinding } from '../diagnostics/report'
import { isAssemblyReady } from '../mapping-ir/transform'

export function buildRosettaPackage(args: {
  document: RosettaDocumentHeader
  totalProposalCount: number
  approved: ApprovedMappingExportRow[]
  skipped: SkippedProposalRow[]
  audit: Omit<ExportAuditSnapshot, 'counts'>
}): RosettaMappingPackage {
  const richIrFor = (row: ApprovedMappingExportRow) =>
    row.ir && isAssemblyReady(row.ir) ? row.ir : undefined

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
    targetTemplate: richIrFor(r)?.target.pathTemplate,
    leafKind: richIrFor(r)?.target.leafKind,
    mappingValue: richIrFor(r)?.value,
    semantics: richIrFor(r)?.semantics,
    grouping: richIrFor(r)?.grouping,
    arrayBinding: richIrFor(r)?.arrayBinding,
    diagnostics: richIrFor(r)?.diagnostics,
    irVersion: richIrFor(r)?.version,
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

  const coverageDiagnostics: CoverageFinding[] = args.skipped.map(s => ({
    code: 'diagnostic_suppressed_export',
    severity: 'warn',
    sourcePath: s.fieldPath,
    message: `Proposal ${s.proposalId} with status ${s.status} was not exported`,
  }))

  const mappingIrs = args.approved
    .map(row => row.ir)
    .filter((ir): ir is NonNullable<typeof ir> => ir != null)

  const diagnostics =
    mappingIrs.length > 0 || coverageDiagnostics.length > 0
      ? {
          collisions: mappingIrs.length > 0 ? findMappingCollisions(mappingIrs) : [],
          coverage: coverageDiagnostics,
        }
      : undefined

  return {
    version: ROSETTA_PACKAGE_VERSION,
    document: args.document,
    mappings,
    coverage,
    diagnostics,
    audit: {
      ...args.audit,
      counts: { mappings: mappings.length, skipped: coverage.skipped.length },
    },
  }
}
