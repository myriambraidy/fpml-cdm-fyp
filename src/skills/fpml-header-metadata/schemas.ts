import { z } from 'zod'
import { BaseSkillInput, BaseSkillOutput } from '../types'

export const FpmlHeaderMetadataInput = BaseSkillInput
export const FpmlHeaderMetadataOutput = BaseSkillOutput

export type FpmlHeaderMetadataInput = z.infer<typeof FpmlHeaderMetadataInput>
export type FpmlHeaderMetadataOutput = z.infer<typeof FpmlHeaderMetadataOutput>
