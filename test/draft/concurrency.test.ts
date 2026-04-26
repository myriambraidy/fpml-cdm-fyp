import { describe, expect, it } from 'bun:test'
import { mapWithConcurrency } from '../../src/draft/concurrency'

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

describe('mapWithConcurrency', () => {
  it('preserves original item order while allowing out-of-order completion', async () => {
    const completions: string[] = []

    const results = await mapWithConcurrency({
      items: ['slow', 'fast-a', 'fast-b'],
      concurrency: 2,
      worker: async (item, index) => {
        await delay(item === 'slow' ? 20 : 1)
        completions.push(item)
        return `${index}:${item}`
      },
    })

    expect(completions).not.toEqual(['slow', 'fast-a', 'fast-b'])
    expect(results).toEqual(['0:slow', '1:fast-a', '2:fast-b'])
  })

  it('runs with a minimum concurrency of one and preserves failures', async () => {
    const results = await mapWithConcurrency({
      items: [1, 2],
      concurrency: 0,
      worker: async item => item * 2,
    })

    expect(results).toEqual([2, 4])
  })
})
