import type { FpmlHeaderMetadataInput, FpmlHeaderMetadataOutput } from './schemas'

/**
 * FPML 5.x messaging / document header fields are not part of CDM TradeState.
 * We mirror them into `packageMeta.*` so exports and assembly preserve provenance
 * without claiming a false CDM synonym.
 */
export const fpmlHeaderMetadataLogic = (
  input: FpmlHeaderMetadataInput
): FpmlHeaderMetadataOutput => {
  const lower = input.fieldName.toLowerCase()
  const path = input.fieldPath.toLowerCase()
  const inHeader = path.includes('/header') || path.includes('header')

  if (lower.includes('conversation') && lower.includes('id')) {
    return {
      cdmPath: 'packageMeta.fpmlHeader.conversationId',
      transformation: 'map_fpml_conversation_id',
      confidence: inHeader ? 88 : 70,
      reasoning:
        'FPML conversationId identifies a workflow thread; CDM trade payload has no standard slot — stored under packageMeta.fpmlHeader.',
    }
  }
  if (lower.includes('message') && lower.includes('id')) {
    return {
      cdmPath: 'packageMeta.fpmlHeader.messageId',
      transformation: 'map_fpml_message_id',
      confidence: inHeader ? 88 : 70,
      reasoning:
        'FPML messageId is transport metadata; preserved in packageMeta.fpmlHeader for lineage.',
    }
  }
  if (lower === 'sentby' || lower.includes('sentby')) {
    return {
      cdmPath: 'packageMeta.fpmlHeader.sentBy',
      transformation: 'map_fpml_sent_by',
      confidence: inHeader ? 82 : 65,
      reasoning: 'FPML sentBy (routing); not a CDM economic field — packageMeta mirror.',
    }
  }
  if (lower === 'sendto' || lower.includes('sendto')) {
    return {
      cdmPath: 'packageMeta.fpmlHeader.sendTo',
      transformation: 'map_fpml_send_to',
      confidence: inHeader ? 82 : 65,
      reasoning: 'FPML sendTo (routing); not a CDM economic field — packageMeta mirror.',
    }
  }

  return {
    cdmPath: 'packageMeta.fpmlHeader.unknown',
    transformation: 'fpml_header_unhandled',
    confidence: 0,
    reasoning: `No header rule for "${input.fieldName}" at ${input.fieldPath}.`,
    todos: ['Extend fpml_header_metadata triggers or logic for this element'],
  }
}
