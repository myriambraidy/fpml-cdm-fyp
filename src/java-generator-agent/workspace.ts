import { mkdir, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import {
  GENERATED_BASE_PACKAGE,
  GENERATED_IMPL_CLASS,
  GENERATED_IMPL_PACKAGE,
  GENERATED_JAVA_VERSION,
} from './java-contract'
import { bulletList } from './markdown'
import { buildEvidencePacket, writeEvidencePacket } from './evidence-packet'
import { buildProductScopeGuidance, renderProductScopeMarkdown } from './product-scope'
import { appendRunLog } from './run-log'
import type { ProductScopeGuidance } from './product-scope'
import type { GeneratorRunConfig, GeneratorWorkspace } from './types'

export async function createWorkspace(
  config: GeneratorRunConfig
): Promise<GeneratorWorkspace> {
  const rootDir = join(config.runOutputDir, 'agent-workspace')
  await mkdir(rootDir, { recursive: true })

  const workspace: GeneratorWorkspace = {
    rootDir,
    inputBriefPath: join(rootDir, '00-input-brief.md'),
    productScopePath: join(rootDir, '00-product-scope.md'),
    productScopeJsonPath: join(rootDir, '00-product-scope.json'),
    evidencePacketPath: join(rootDir, 'evidence-packet.md'),
    evidencePacketJsonPath: join(rootDir, 'evidence-packet.json'),
    evidenceIndexPath: join(rootDir, 'evidence-index.md'),
    javaShellContractPath: join(rootDir, 'java-shell-contract.md'),
    runLogPath: join(rootDir, '00-run-log.md'),
    acceptedPlanPath: join(rootDir, 'accepted-plan.md'),
    implementationPlanPath: join(rootDir, 'implementation-plan.md'),
    implementationLogPath: join(rootDir, 'implementation-log.md'),
    repairLogPath: join(rootDir, 'repair-log.md'),
    finalBuildReportPath: join(rootDir, 'final-build-report.md'),
  }

  if (!config.resume || !(await exists(workspace.productScopeJsonPath))) {
    const productScope = await buildProductScopeGuidance({ productFamily: config.productFamily })
    const evidencePacket = await buildEvidencePacket(productScope)

    await writeFile(workspace.inputBriefPath, renderInputBrief(config), 'utf8')
    await writeFile(workspace.productScopePath, renderProductScopeMarkdown(productScope), 'utf8')
    await writeFile(workspace.productScopeJsonPath, JSON.stringify(productScope, null, 2), 'utf8')
    await writeEvidencePacket({
      packet: evidencePacket,
      markdownPath: workspace.evidencePacketPath,
      jsonPath: workspace.evidencePacketJsonPath,
    })
    await writeFile(workspace.evidenceIndexPath, renderEvidenceIndex(config, productScope), 'utf8')
    await writeFile(workspace.javaShellContractPath, renderJavaShellContract(config), 'utf8')
    await writeFile(workspace.runLogPath, renderRunLogStart(config), 'utf8')
    await writeFile(workspace.implementationPlanPath, '# Implementation Plan\n\n', 'utf8')
    await writeFile(workspace.implementationLogPath, '# Implementation Log\n\n', 'utf8')
    await writeFile(workspace.repairLogPath, '# Repair Log\n\n', 'utf8')
    await writeFile(workspace.finalBuildReportPath, '# Final Build Report\n\n', 'utf8')
  }

  await appendRunLog(workspace.runLogPath, {
    title: 'Workspace created',
    details: {
      runId: config.runId,
      productFamily: config.productFamily,
      runOutputDir: config.runOutputDir,
    },
  })

  return workspace
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

function renderInputBrief(config: GeneratorRunConfig): string {
  const roleModels = Object.entries(config.roleModels)
    .map(([role, model]) => `- ${role}: ${model.model}, maxTokens=${model.maxTokens}`)
    .join('\n')

  return `# Input Brief

Run id: ${config.runId}
Product family: ${config.productFamily}

Role models:
${roleModels}

Goal:

Build an AI-native generator run for the FX derivatives family. Use the
precomputed product-scope guidance and evidence packet instead of discovering
product scope through broad search. Generate a Java Maven mapper project, run
gates, and repair failures. The shipped Java mapper runtime must not call an LLM
and must not read this agent workspace.

Runtime fixtures for this run:
${bulletList(config.runtimeFixtures.map(fixture => `${fixture.id}: ${fixture.fixtureFileName}`))}
`
}

function renderEvidenceIndex(config: GeneratorRunConfig, scope: ProductScopeGuidance): string {
  const runtimeFixtureIds = new Set(config.runtimeFixtures.map(fixture => fixture.fpmlPath))
  const runtimeFixtures = scope.classifiedFixtures.filter(fixture => runtimeFixtureIds.has(fixture.fpmlPath))
  const observedFixtures = scope.classifiedFixtures.filter(fixture => !runtimeFixtureIds.has(fixture.fpmlPath))
  return `# Evidence Index

Use this file as the default context map. Fetch detailed evidence only when needed.

## Runtime Fixtures

${bulletList(runtimeFixtures.map(fixture => `${fixture.productGroup}: ${fixture.fpmlPath}`))}

## Observed But Not Runtime Supported

${bulletList(observedFixtures.map(fixture => `${fixture.productGroup}: ${fixture.fpmlPath}`))}

## Detailed Evidence Sources

- Full evidence packet: agent-workspace/evidence-packet.md
- Product scope JSON: agent-workspace/00-product-scope.json
- Rosetta FX docs: data/rosetta-source/latest/docs/product-families/fx.md
- Shared Rosetta ingest docs: data/rosetta-source/latest/docs/shared-ingest.md
`
}

function renderJavaShellContract(config: GeneratorRunConfig): string {
  return `# Java Shell Contract

Java target: ${GENERATED_JAVA_VERSION}
Base package: ${GENERATED_BASE_PACKAGE}
Generated implementation package: ${GENERATED_IMPL_PACKAGE}
Generated implementation class: ${GENERATED_IMPL_CLASS}

## Shell-Owned Files

- pom.xml
- src/main/java/com/fpml/cdm/fx/mapper/Main.java
- src/main/java/com/fpml/cdm/fx/mapper/RuntimeArgs.java
- src/main/java/com/fpml/cdm/fx/mapper/FpmlToCdmMapper.java

## Generated-Owned Files

- src/main/java/com/fpml/cdm/fx/mapper/generated/**
- src/test/java/**
- reports/**

## Runtime Fixtures

${bulletList(config.runtimeFixtures.map(fixture => `${fixture.id}: fixtures/${fixture.fixtureFileName}`))}
`
}

function renderRunLogStart(config: GeneratorRunConfig): string {
  return `# Run Log

Run id: ${config.runId}
Started: ${new Date().toISOString()}
Product family: ${config.productFamily}
Base output dir: ${config.baseOutputDir}
Run output dir: ${config.runOutputDir}
Max planning rounds: ${config.maxPlanningRounds}
Max repair attempts: ${config.maxRepairAttempts}
Resume: ${config.resume ? 'yes' : 'no'}

Evidence folders:
${bulletList(config.evidenceRoots)}
`
}
