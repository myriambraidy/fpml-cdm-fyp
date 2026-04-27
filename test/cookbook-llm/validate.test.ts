import { describe, expect, it } from 'bun:test'
import { validateAuthoredPage } from '../../src/cookbook-llm/validate'
import {
  authoredPage,
  makePacket,
  passAudit,
  passCritic,
  passJudge,
} from './helpers'

describe('validateAuthoredPage', () => {
  it('accepts a grounded passed page', () => {
    const page = authoredPage()
    const issues = validateAuthoredPage({
      packet: makePacket(),
      result: {
        packetId: 'index',
        subjectType: 'index',
        title: 'Index',
        finalPage: page,
        finalDecision: 'pass',
        llmCalls: [],
        iterations: [
          {
            iteration: 1,
            page,
            criticReport: passCritic(),
            auditReport: passAudit(page.claims[0]!.claim),
            judgeReport: passJudge(),
          },
        ],
      },
    })

    expect(issues.filter(issue => issue.severity === 'error')).toHaveLength(0)
  })

  it('rejects missing evidence references', () => {
    const page = {
      ...authoredPage(),
      claims: [
        {
          ...authoredPage().claims[0]!,
          evidenceIds: ['missing:evidence'],
        },
      ],
    }
    const issues = validateAuthoredPage({
      packet: makePacket(),
      result: {
        packetId: 'index',
        subjectType: 'index',
        title: 'Index',
        finalPage: page,
        finalDecision: 'pass',
        llmCalls: [],
        iterations: [],
      },
    })

    expect(issues.some(issue => issue.code === 'claim_missing_evidence_reference')).toBe(true)
  })
})
