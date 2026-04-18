import { zodToJsonSchema } from 'zod-to-json-schema'
import type { Skill } from '../skills/types'
import type { LLMTool } from './types'

export const skillToTool = (skill: Skill): LLMTool => {
  const input_schema = zodToJsonSchema(skill.inputSchema, {
    $refStrategy: 'none',
  }) as Record<string, unknown>

  return {
    name: skill.name,
    description: skill.description,
    input_schema,
  }
}

export const getToolsFromSkills = (skills: Skill[]): LLMTool[] =>
  skills.map(skillToTool)
