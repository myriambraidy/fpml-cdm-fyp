import { describe, expect, it } from 'bun:test'
import { runAuthoringLoop } from '../../src/cookbook-llm/loop'
import { silentLogger } from '../../src/cookbook-llm/logger'
import {
  authoredPage,
  jsonResponse,
  makeConfig,
  makePacket,
  passAudit,
  passCritic,
  passJudge,
  QueueLlmClient,
  repairJudge,
} from './helpers'

describe('runAuthoringLoop', () => {
  it('passes on the first iteration', async () => {
    const page = authoredPage()
    const llm = new QueueLlmClient([
      jsonResponse(page),
      jsonResponse(passCritic()),
      jsonResponse(passAudit(page.claims[0]!.claim)),
      jsonResponse(passJudge()),
    ])
    const result = await runAuthoringLoop({
      llm,
      config: makeConfig('C:/tmp'),
      packet: makePacket(),
      logger: silentLogger,
    })

    expect(result.finalDecision).toBe('pass')
    expect(result.iterations).toHaveLength(1)
  })

  it('repairs then passes', async () => {
    const page = authoredPage()
    const llm = new QueueLlmClient([
      jsonResponse(page),
      jsonResponse(passCritic()),
      jsonResponse(passAudit(page.claims[0]!.claim)),
      jsonResponse(repairJudge()),
      jsonResponse(page),
      jsonResponse(passCritic()),
      jsonResponse(passAudit(page.claims[0]!.claim)),
      jsonResponse(passJudge()),
    ])
    const result = await runAuthoringLoop({
      llm,
      config: makeConfig('C:/tmp'),
      packet: makePacket(),
      logger: silentLogger,
    })

    expect(result.finalDecision).toBe('pass')
    expect(result.iterations).toHaveLength(2)
  })
})
