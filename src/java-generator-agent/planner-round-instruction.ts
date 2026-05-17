export function buildPlannerRoundInstruction(round: number): string {
  if (round === 1) return 'Write the first planner-plan.md for this FX derivatives generator run.'
  return [
    'Write a revised planner-plan.md using the previous round critique and resolution.',
    'Remove every previous blocking issue exactly. Do not repeat a class, enum constant, fixture formatting error, or missing section named in previous plan-validation.md.',
    'If previous validation rejected a CDM class or enum constant, do not mention it as an implementation target unless approved-cdm-api-contract-summary.md proves it.',
    'Runtime fixture bullets must contain exact runtime fixture ids, with an optional colon description only.',
  ].join('\n')
}
