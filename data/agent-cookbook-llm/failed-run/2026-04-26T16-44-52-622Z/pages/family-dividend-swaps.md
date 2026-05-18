# FPML -> CDM Cookbook: dividend-swaps

## Status

- Operational status: blocked
- Agent use policy: Agents must not use this folder as semantic mapping knowledge.
- Why blocked
  - Publication status is failed_pair_analysis; no pair analyses completed successfully.
  - Rollout readiness decision is not_ready.
  - Quality rating is poor; synthesis fell back to deterministic output.
  - Semantic success rate is 0% and full parse rate is 0%.
  - Stable mapping rule count is 0 and repeated transformation count is 0.
  - Open-question density is 100% with placeholder-heavy highlights.

## Trigger Signals

- No validated trigger signals are available for this family at this time.
- Reason: No semantic synthesis was recovered and pair analyses did not complete successfully.
- Until successful pair analyses exist, do not rely on any trigger signal list for this folder.

## Canonical Mapping Procedure

- None available. Blocked due to:
  - No semantic synthesis recovered.
  - Zero stable mapping rules and zero repeated transformations recovered.
  - Failed pair analyses and not-ready rollout status.

## Do Not Assume

- Do not assume any semantic mapping rules for dividend-swaps.
- Do not assume any trigger signals, product variants, or branches are validated.
- Do not assume any transformations, enrichments, or defaults.
- Do not assume wrapper or metadata fields imply stable semantic mappings.

## Human Review Triggers

- Any attempt to auto-map dividend-swaps based on this folder.
- Any claim that stable rules or transformations exist for this family.
- Any use without completed, successful pair analyses and recovered stable rules.

## Validation Checklist

- Confirm at least one successful pair analysis exists for the target case; if not, stop.
- Confirm non-zero stable mapping rules and repeated transformations; if not, stop.
- Confirm rollout readiness has moved beyond not_ready and quality rating has improved; if not, stop.

## Source Evidence

- dividend-swaps:QUALITY — Coverage, publication status, quality assessment, rollout readiness, and metrics.
- dividend-swaps:OPEN-001 — Open-question note that no semantic synthesis was recovered.

## Operational Limitations

- This folder cannot be used to derive FPML -> CDM mappings for dividend-swaps.
- Usage is blocked until successful pair analyses are available and stable mapping rules/transformations are recovered, with improved quality metrics and readiness.