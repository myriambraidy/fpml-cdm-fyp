import { readFile } from 'node:fs/promises'

export async function selectPlannerArtifactContent(args: {
  modelContent: string
  artifactPath: string
}): Promise<string> {
  if (hasRequiredPlannerSections(args.modelContent)) return args.modelContent
  const existingContent = await readExistingPlannerArtifact(args.artifactPath)
  if (existingContent !== null && hasRequiredPlannerSections(existingContent)) {
    return existingContent
  }
  return args.modelContent
}

export function hasRequiredPlannerSections(markdown: string): boolean {
  return [
    /^##\s+Implementation scope \(machine-checked\)\s*$/im,
    /^##\s+Runtime supported fixtures \(machine-checked\)\s*$/im,
    /^##\s+Java shell contract \(machine-checked\)\s*$/im,
    /^##\s+Rosetta evidence coverage \(machine-checked\)\s*$/im,
  ].every(pattern => pattern.test(markdown))
}

async function readExistingPlannerArtifact(path: string): Promise<string | null> {
  try {
    return await readFile(path, 'utf8')
  } catch {
    return null
  }
}
