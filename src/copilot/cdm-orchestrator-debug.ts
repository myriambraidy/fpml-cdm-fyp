/** Debug trace for CDM orchestrator runs (console + optional API payload). */

export type CdmOrchestratorDebugEvent = {
  t: string
  phase: string
  detail?: Record<string, unknown>
}

export type CdmOrchestratorDebugPayload = {
  finalStatus: string
  startedAtIso: string
  durationMs: number
  model: string
  events: CdmOrchestratorDebugEvent[]
}

export class CdmOrchestratorRunDebug {
  private readonly t0 = Date.now()
  readonly events: CdmOrchestratorDebugEvent[] = []

  constructor(
    readonly active: boolean,
    readonly model: string
  ) {}

  log(phase: string, detail?: Record<string, unknown>) {
    const row: CdmOrchestratorDebugEvent = {
      t: new Date().toISOString(),
      phase,
      detail: detail && Object.keys(detail).length ? detail : undefined,
    }
    this.events.push(row)
    if (this.active) {
      const suffix = row.detail ? ` ${JSON.stringify(row.detail)}` : ''
      console.log(`[cdm-orchestrator] ${phase}${suffix}`)
    }
  }

  payload(finalStatus: string): CdmOrchestratorDebugPayload {
    return {
      finalStatus,
      startedAtIso: new Date(this.t0).toISOString(),
      durationMs: Date.now() - this.t0,
      model: this.model,
      events: [...this.events],
    }
  }
}
