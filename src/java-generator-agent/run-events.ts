import { appendFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import type { GateResult, GeneratorRole, GeneratorRunConfig, JsonValue, RolePhase } from './types'

export type RunEventKind =
  | 'workspace.created'
  | 'stage.started'
  | 'stage.completed'
  | 'role.phase.started'
  | 'role.phase.completed'
  | 'llm.call.started'
  | 'llm.call.completed'
  | 'tool.call.started'
  | 'tool.call.completed'
  | 'gate.run.started'
  | 'gate.run.completed'
  | 'artifact.written'
  | 'policy.failed'
  | 'repair.requirement'
  | 'run.completed'

export type RunEvent = {
  schemaVersion: 1
  eventId: string
  sequence: number
  timestamp: string
  runId: string
  kind: RunEventKind
  role?: GeneratorRole
  round?: number
  attempt?: number
  phase?: RolePhase
  model?: string
  llmCallId?: string
  toolCallId?: string
  tool?: string
  status?: 'started' | 'passed' | 'failed' | 'blocked' | 'skipped'
  summary?: string
  details?: Record<string, JsonValue>
  artifactPaths?: string[]
}

export type RunEventWriter = {
  emit(event: Omit<RunEvent, 'schemaVersion' | 'eventId' | 'sequence' | 'timestamp' | 'runId'>): Promise<RunEvent>
}

export function createRunEventWriter(config: GeneratorRunConfig): RunEventWriter {
  let sequence = 0
  const path = resolve(config.runOutputDir, 'build-reports', 'run-events.jsonl')

  return {
    async emit(event) {
      sequence += 1
      const fullEvent: RunEvent = {
        schemaVersion: 1,
        eventId: `${config.runId}:${String(sequence).padStart(6, '0')}`,
        sequence,
        timestamp: new Date().toISOString(),
        runId: config.runId,
        ...event,
      }
      await mkdir(dirname(path), { recursive: true })
      await appendFile(path, `${JSON.stringify(fullEvent)}\n`, 'utf8')
      return fullEvent
    },
  }
}

export function runEventsPath(config: GeneratorRunConfig): string {
  return resolve(config.runOutputDir, 'build-reports', 'run-events.jsonl')
}

export function roleTranscriptPath(args: {
  runOutputDir: string
  role: GeneratorRole
  round?: number
  attempt?: number
  phase?: RolePhase
}): string {
  const parts: string[] = [args.role]
  if (args.round !== undefined) parts.push(`round-${String(args.round).padStart(2, '0')}`)
  if (args.attempt !== undefined) parts.push(`attempt-${String(args.attempt).padStart(2, '0')}`)
  if (args.phase !== undefined) parts.push(args.phase)
  const name = `${parts.join('-')}.md`
  return resolve(args.runOutputDir, 'build-reports', 'role-transcripts', name)
}

export function gateFailureNames(results: GateResult[]): string[] {
  return results.filter(gate => gate.status === 'failed').map(gate => gate.name)
}
