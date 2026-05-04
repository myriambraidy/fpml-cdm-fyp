import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

export async function listFilesRecursive(root: string): Promise<string[]> {
  const rootStat = await stat(root)
  if (rootStat.isFile()) return [root]

  const found: string[] = []

  async function visit(dir: string): Promise<void> {
    const entries = await readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const child = join(dir, entry.name)
      if (entry.isDirectory()) {
        await visit(child)
      } else if (entry.isFile()) {
        found.push(child)
      }
    }
  }

  await visit(root)
  return found
}
