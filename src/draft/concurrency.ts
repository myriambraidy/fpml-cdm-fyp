export async function mapWithConcurrency<TItem, TResult>(args: {
  items: TItem[]
  concurrency: number
  worker: (item: TItem, index: number) => Promise<TResult>
}): Promise<TResult[]> {
  const { items, worker } = args
  const concurrency = Math.max(1, Math.min(args.concurrency, items.length || 1))
  const results = new Array<TResult>(items.length)
  let nextIndex = 0

  async function runWorker(): Promise<void> {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex
      nextIndex += 1
      results[currentIndex] = await worker(items[currentIndex]!, currentIndex)
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => runWorker()))
  return results
}
