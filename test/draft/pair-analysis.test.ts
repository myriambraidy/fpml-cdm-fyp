import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { describe, expect, it } from 'bun:test'
import { analyzeDraftPair } from '../../src/draft/pair-analysis'
import { QueueMockLLM } from '../agent/mock-llm'

describe('analyzeDraftPair', () => {
  it('salvages truncated structured responses into usable semantic evidence', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'draft-pair-analysis-'))

    try {
      const fpmlPath = join(tempDir, 'fx.xml')
      const cdmPath = join(tempDir, 'fx.json')

      await writeFile(
        fpmlPath,
        `<?xml version="1.0" encoding="UTF-8"?>
<FpML>
  <header>
    <conversationId>conv-1</conversationId>
  </header>
  <trade>
    <tradeHeader>
      <tradeDate>2001-11-19Z</tradeDate>
      <partyTradeIdentifier>
        <partyReference href="party1" />
        <tradeId>FX123</tradeId>
      </partyTradeIdentifier>
    </tradeHeader>
  </trade>
  <party id="party1">
    <partyName>Bank A</partyName>
  </party>
</FpML>`,
        'utf8'
      )

      await writeFile(
        cdmPath,
        JSON.stringify(
          {
            trade: {
              tradeIdentifier: [
                {
                  issuerReference: { externalReference: 'party1' },
                  assignedIdentifier: [{ identifier: { value: 'FX123' } }],
                },
              ],
              tradeDate: { value: '2001-11-19' },
              party: [{ name: { value: 'Bank A' } }],
            },
            meta: { globalKey: 'meta-1' },
          },
          null,
          2
        ),
        'utf8'
      )

      const llm = new QueueMockLLM([
        {
          content: `{
  "productOrTradeFamily": "fx-derivatives",
  "mappingObservations": [
    {
      "sourcePaths": ["/FpML/trade/tradeHeader/tradeDate"],
      "targetPaths": ["$.trade.tradeDate.value"],
      "classification": "normalized",
      "mappingNote": "tradeDate -> trade.tradeDate.value",
      "confidence": "high",
      "whyNote": "date normalized"
    },
    {
      "sourcePaths": ["/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId"],
      "targetPaths": ["$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value"],
      "classification": "direct",
      "mappingNote": "tradeId -> assignedIdentifier.identifier.value",
      "confidence": "high",
      "whyNote": "exact value match"
    },
    {
      "sourcePaths": ["/FpML/party[@id='party1']/partyName"],
      "targetPaths": ["$.trade.party[0].name.value"],
      "classification": "direct",
      "mappingNote": "partyName -> party.name.value",
      "confidence": "high",
      "whyNote": "same party name"
    },
`,
        },
      ])

      const analysis = await analyzeDraftPair({
        pair: {
          folder: 'fx-derivatives',
          fpmlRelativePath: 'fx-derivatives/fx.xml',
          cdmRelativePath: 'fx-derivatives/fx.json',
          fpmlAbsolutePath: fpmlPath,
          cdmAbsolutePath: cdmPath,
          pairingStrategy: 'exact',
        },
        llm,
        model: 'test-model',
        maxRetries: 0,
      })

      expect(analysis.status).toBe('success')
      expect(analysis.semanticRecovery).toBe('salvaged')
      expect(analysis.mappingObservations.length).toBeGreaterThan(0)
      expect(analysis.pairHighlight.importantMappings[0]).toContain('tradeDate')
    } finally {
      await rm(tempDir, { recursive: true, force: true })
    }
  })

  it('retries once when the first structured response is empty', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'draft-pair-analysis-'))

    try {
      const fpmlPath = join(tempDir, 'fx.xml')
      const cdmPath = join(tempDir, 'fx.json')

      await writeFile(
        fpmlPath,
        `<?xml version="1.0" encoding="UTF-8"?>
<FpML>
  <trade>
    <tradeHeader>
      <tradeDate>2001-11-19Z</tradeDate>
    </tradeHeader>
  </trade>
</FpML>`,
        'utf8'
      )

      await writeFile(
        cdmPath,
        JSON.stringify(
          {
            trade: {
              tradeDate: { value: '2001-11-19' },
            },
          },
          null,
          2
        ),
        'utf8'
      )

      const llm = new QueueMockLLM([
        { content: '' },
        {
          content: JSON.stringify({
            productOrTradeFamily: 'fx-derivatives',
            mappingObservations: [
              {
                sourcePaths: ['/FpML/trade/tradeHeader/tradeDate'],
                targetPaths: ['$.trade.tradeDate.value'],
                classification: 'normalized',
                mappingNote: 'tradeDate normalized',
                confidence: 'high',
                whyNote: 'date normalized',
              },
            ],
            transformations: [],
            enrichments: [],
            openQuestions: [],
          }),
        },
      ])

      const analysis = await analyzeDraftPair({
        pair: {
          folder: 'fx-derivatives',
          fpmlRelativePath: 'fx-derivatives/fx.xml',
          cdmRelativePath: 'fx-derivatives/fx.json',
          fpmlAbsolutePath: fpmlPath,
          cdmAbsolutePath: cdmPath,
          pairingStrategy: 'exact',
        },
        llm,
        model: 'test-model',
        maxRetries: 1,
      })

      expect(analysis.status).toBe('success')
      expect(analysis.semanticRecovery).toBe('full')
      expect(analysis.mappingObservations).toHaveLength(1)
    } finally {
      await rm(tempDir, { recursive: true, force: true })
    }
  })
})
