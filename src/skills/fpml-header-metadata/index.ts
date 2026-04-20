import type { Skill } from '../types'
import { FpmlHeaderMetadataInput, FpmlHeaderMetadataOutput } from './schemas'
import { fpmlHeaderMetadataLogic } from './logic'
import { registerSkill } from '../registry'

export const fpmlHeaderMetadataSkill: Skill = {
  name: 'fpml_header_metadata',
  description:
    'Captures FPML document/messaging header fields (conversationId, messageId, sentBy, sendTo) into packageMeta for provenance; not CDM TradeState economics.',
  inputSchema: FpmlHeaderMetadataInput,
  outputSchema: FpmlHeaderMetadataOutput,
  fn: fpmlHeaderMetadataLogic,
  triggers: {
    keywords: ['conversationid', 'messageid', 'sentby', 'sendto'],
  },
}

registerSkill(fpmlHeaderMetadataSkill)
