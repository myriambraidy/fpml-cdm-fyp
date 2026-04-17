import { describe, expect, it } from 'bun:test'
import '../../src/skills'
import { getAllSkills, matchSkills } from '../../src/skills/registry'

describe('skill registry', () => {
  it('loads all 6 skills', () => {
    expect(getAllSkills()).toHaveLength(6)
  })

  it('cardinality_checker does not auto-trigger by design', () => {
    const matched = matchSkills({ name: 'anything', type: 'string', path: '/trade/anything' })
    expect(matched.some(skill => skill.name === 'cardinality_checker')).toBeFalse()
  })

  it('matches domain skills from field names', () => {
    const buyerMatches = matchSkills({ name: 'buyer', type: 'string', path: '/trade/buyer' })
    expect(buyerMatches.some(skill => skill.name === 'party_resolver')).toBeTrue()

    const swapMatches = matchSkills({ name: 'swapStream', type: 'object', path: '/trade/swapStream' })
    expect(swapMatches.some(skill => skill.name === 'ir_swap_resolver')).toBeTrue()
  })
})
