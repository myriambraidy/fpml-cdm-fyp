import { z } from 'zod'

export const CanonicalSegmentSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('property'),
    name: z.string().min(1),
  }),
  z.object({
    kind: z.literal('array'),
    name: z.string().min(1),
    bindingKey: z.string().min(1),
  }),
])

export const CanonicalTargetSchema = z.object({
  root: z.enum(['trade', 'tradeState', 'businessEvent']),
  segments: z.array(CanonicalSegmentSchema),
})
