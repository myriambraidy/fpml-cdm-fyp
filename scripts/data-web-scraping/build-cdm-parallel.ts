import {
  copyFile,
  mkdir,
  readdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import * as path from "node:path";

type MatchStrategy = "exact" | "normalized" | "alias";

type FileMatch = {
  sourcePath: string;
  sourceBaseName: string;
  strategy: MatchStrategy;
};

type ManifestEntry = {
  fpmlRelativePath: string;
  cdmRelativePath: string | null;
  sourceBaseName: string | null;
  strategy: MatchStrategy | "missing";
  status: "matched" | "missing";
};

type Summary = {
  totalFpmlFiles: number;
  totalCdmCandidates: number;
  matchedFiles: number;
  missingFiles: number;
  byStrategy: Record<string, number>;
  byCategory: Record<string, { total: number; matched: number; missing: number }>;
};

const SAFE_SUFFIXES = [
  "-versioned",
  "-usi-uti",
  "-physical-exercise",
  "-plus-rate-observation",
  "-no-discounting",
  "-other-party",
  "-usi",
  "-uti",
];

const ALIAS_MAP: Record<string, string> = {
  "fx-ex21-avg-rate-option-specific": "fx-ex22-avg-rate-option-specific",
  "fx-ex22-straddle": "fx-ex23-straddle",
  "fx-ex23-delta-hedge": "fx-ex24-delta-hedge",
  "eqs-ex11-on-european-index-underlyer-short-form":
    "eqs-ex12-on-european-index-underlyer-short-form",
};

async function walkFiles(rootDir: string): Promise<string[]> {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function normalizeBaseName(baseName: string): string {
  let normalized = baseName.toLowerCase();
  normalized = normalized.replace(/-ex-/g, "-ex");
  normalized = normalized.replace(/-ex(\d)(?=-|$)/g, "-ex0$1");

  for (const suffix of SAFE_SUFFIXES) {
    if (normalized.endsWith(suffix)) {
      return normalized.slice(0, -suffix.length);
    }
  }

  return normalized;
}

function scoreCandidate(fpmlBaseName: string, sourcePath: string): number {
  const sourceBaseName = path.basename(sourcePath, ".json");
  let score = 0;

  if (sourceBaseName === fpmlBaseName) score += 100;
  if (normalizeBaseName(sourceBaseName) === normalizeBaseName(fpmlBaseName)) score += 40;
  if (sourcePath.includes(`${path.sep}fpml-5-10-products-`)) score += 30;
  if (sourcePath.includes(`${path.sep}fpml-5-10-incomplete-products-`)) score += 10;
  if (sourcePath.includes(`${path.sep}fpml-5-10-invalid-products${path.sep}`)) score -= 100;

  const lengthDelta = Math.abs(sourceBaseName.length - fpmlBaseName.length);
  score -= Math.min(lengthDelta, 20);

  return score;
}

function pickBestCandidate(fpmlBaseName: string, candidates: string[]): string {
  return [...candidates].sort((left, right) => {
    const scoreDelta = scoreCandidate(fpmlBaseName, right) - scoreCandidate(fpmlBaseName, left);
    if (scoreDelta !== 0) return scoreDelta;
    return left.localeCompare(right);
  })[0];
}

function lookupMatch(
  fpmlBaseName: string,
  exactLookup: Map<string, string[]>,
  normalizedLookup: Map<string, string[]>,
): FileMatch | null {
  const exactCandidates = exactLookup.get(fpmlBaseName);
  if (exactCandidates?.length) {
    const sourcePath = pickBestCandidate(fpmlBaseName, exactCandidates);
    return {
      sourcePath,
      sourceBaseName: path.basename(sourcePath, ".json"),
      strategy: "exact",
    };
  }

  const normalizedKey = normalizeBaseName(fpmlBaseName);
  const normalizedCandidates = normalizedLookup.get(normalizedKey);
  if (normalizedCandidates?.length) {
    const sourcePath = pickBestCandidate(fpmlBaseName, normalizedCandidates);
    return {
      sourcePath,
      sourceBaseName: path.basename(sourcePath, ".json"),
      strategy: "normalized",
    };
  }

  const aliasTarget = ALIAS_MAP[normalizedKey];
  if (aliasTarget) {
    const aliasCandidates = exactLookup.get(aliasTarget) ?? normalizedLookup.get(normalizeBaseName(aliasTarget));
    if (aliasCandidates?.length) {
      const sourcePath = pickBestCandidate(aliasTarget, aliasCandidates);
      return {
        sourcePath,
        sourceBaseName: path.basename(sourcePath, ".json"),
        strategy: "alias",
      };
    }
  }

  return null;
}

async function ensureCleanTarget(targetDir: string, workspaceRoot: string): Promise<void> {
  const resolvedTarget = path.resolve(targetDir);
  const resolvedWorkspace = path.resolve(workspaceRoot);

  if (!resolvedTarget.startsWith(resolvedWorkspace)) {
    throw new Error(`Refusing to clear target outside workspace: ${resolvedTarget}`);
  }

  try {
    const targetStat = await stat(resolvedTarget);
    if (targetStat.isDirectory()) {
      await rm(resolvedTarget, { recursive: true, force: true });
    }
  } catch {
    // Target does not exist yet.
  }

  await mkdir(resolvedTarget, { recursive: true });
}

async function main(): Promise<void> {
  const workspaceRoot = process.cwd();
  const fpmlRoot = path.resolve(workspaceRoot, "data_to_learn_from", "fpml");
  const cdmRoot = path.resolve(
    workspaceRoot,
    "data_to_learn_from",
    "cdm",
    "rosetta-source",
    "src",
    "main",
    "resources",
    "ingest",
    "output",
    "fpml-confirmation-to-trade-state",
  );
  const targetRoot = path.resolve(workspaceRoot, "data_to_learn_from", "cdm_parallel");

  const fpmlFiles = (await walkFiles(fpmlRoot)).filter((file) => file.endsWith(".xml"));
  const cdmFiles = (await walkFiles(cdmRoot)).filter((file) => file.endsWith(".json"));

  const exactLookup = new Map<string, string[]>();
  const normalizedLookup = new Map<string, string[]>();

  for (const filePath of cdmFiles) {
    const baseName = path.basename(filePath, ".json");
    const normalized = normalizeBaseName(baseName);

    exactLookup.set(baseName, [...(exactLookup.get(baseName) ?? []), filePath]);
    normalizedLookup.set(normalized, [...(normalizedLookup.get(normalized) ?? []), filePath]);
  }

  await ensureCleanTarget(targetRoot, workspaceRoot);

  const manifestEntries: ManifestEntry[] = [];
  const summary: Summary = {
    totalFpmlFiles: fpmlFiles.length,
    totalCdmCandidates: cdmFiles.length,
    matchedFiles: 0,
    missingFiles: 0,
    byStrategy: { exact: 0, normalized: 0, alias: 0, missing: 0 },
    byCategory: {},
  };

  for (const fpmlFile of fpmlFiles) {
    const relativePath = path.relative(fpmlRoot, fpmlFile);
    const category = relativePath.split(path.sep)[0] ?? "uncategorized";
    const fpmlBaseName = path.basename(fpmlFile, ".xml");
    const destinationRelativePath = relativePath.replace(/\.xml$/i, ".json");
    const destinationPath = path.join(targetRoot, destinationRelativePath);

    if (!summary.byCategory[category]) {
      summary.byCategory[category] = { total: 0, matched: 0, missing: 0 };
    }
    summary.byCategory[category].total += 1;

    await mkdir(path.dirname(destinationPath), { recursive: true });

    const match = lookupMatch(fpmlBaseName, exactLookup, normalizedLookup);

    if (match) {
      await copyFile(match.sourcePath, destinationPath);
      manifestEntries.push({
        fpmlRelativePath: relativePath,
        cdmRelativePath: path.relative(targetRoot, destinationPath),
        sourceBaseName: match.sourceBaseName,
        strategy: match.strategy,
        status: "matched",
      });
      summary.matchedFiles += 1;
      summary.byStrategy[match.strategy] += 1;
      summary.byCategory[category].matched += 1;
    } else {
      manifestEntries.push({
        fpmlRelativePath: relativePath,
        cdmRelativePath: null,
        sourceBaseName: null,
        strategy: "missing",
        status: "missing",
      });
      summary.missingFiles += 1;
      summary.byStrategy.missing += 1;
      summary.byCategory[category].missing += 1;
    }
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    sourceRoots: {
      fpml: fpmlRoot,
      cdmIngestOutput: cdmRoot,
      curatedOutput: targetRoot,
    },
    notes: [
      "This curated folder is built from the CDM ingest output that already mirrors many FpML example filenames.",
      "Only conservative matches are included: exact basename matches, normalized matches, and a few explicit aliases.",
      "Unmatched FpML files remain listed in the manifest so an agent can distinguish missing coverage from missing parsing.",
    ],
    summary,
    entries: manifestEntries,
  };

  const readme = `# CDM Parallel Dataset

This folder is a curated CDM view built to mirror \`data_to_learn_from/fpml\`.

Rules used:

- Exact filename matches first
- Conservative normalization for naming drift such as \`com-ex1\` -> \`com-ex01\`
- A few explicit aliases for known numbering/name shifts in the CDM ingest output
- Raw CDM files are left untouched in \`data_to_learn_from/cdm\`

Important:

- A JSON file exists here only when a conservative CDM counterpart was found
- Missing counterparts are recorded in \`manifest.json\`
- Destination filenames follow the FpML filenames so agents can compare sibling files directly
`;

  await writeFile(path.join(targetRoot, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  await writeFile(path.join(targetRoot, "README.md"), readme, "utf8");

  console.log(`Built curated CDM parallel dataset at ${targetRoot}`);
  console.log(`Matched ${summary.matchedFiles} of ${summary.totalFpmlFiles} FpML files.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
