import { mkdir, writeFile } from "node:fs/promises";
import * as path from "node:path";

type GitTreeEntry = {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size?: number;
  url: string;
};

type GitTreeResponse = {
  sha: string;
  truncated: boolean;
  tree: GitTreeEntry[];
};

type CliOptions = {
  repo: string;
  branch: string;
  outDir: string;
  prefixes: string[];
  limit?: number;
  dryRun: boolean;
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    repo: "finos/common-domain-model",
    branch: "master",
    outDir: "data_to_learn_from/cdm",
    prefixes: ["examples/", "ingest/", "rosetta-source/"],
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === "--repo" && next) {
      options.repo = next;
      i += 1;
      continue;
    }
    if (arg === "--branch" && next) {
      options.branch = next;
      i += 1;
      continue;
    }
    if (arg === "--out" && next) {
      options.outDir = next;
      i += 1;
      continue;
    }
    if (arg === "--prefix" && next) {
      options.prefixes = next
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
      i += 1;
      continue;
    }
    if (arg === "--limit" && next) {
      const value = Number.parseInt(next, 10);
      if (!Number.isNaN(value) && value > 0) {
        options.limit = value;
      }
      i += 1;
      continue;
    }
    if (arg === "--dry-run") {
      options.dryRun = true;
    }
  }

  return options;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "fpml-cdm-fyp-fetcher",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${url}`);
  }

  return (await response.json()) as T;
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "fpml-cdm-fyp-fetcher",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${url}`);
  }

  return response.text();
}

function shouldKeepFile(filePath: string, prefixes: string[]): boolean {
  if (!filePath.endsWith(".json")) {
    return false;
  }

  return prefixes.some((prefix) => filePath.startsWith(prefix));
}

function toRawUrl(repo: string, branch: string, filePath: string): string {
  return `https://raw.githubusercontent.com/${repo}/${branch}/${filePath}`;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const treeUrl = `https://api.github.com/repos/${options.repo}/git/trees/${options.branch}?recursive=1`;

  console.log(`Listing files from ${options.repo}@${options.branch} ...`);
  const tree = await fetchJson<GitTreeResponse>(treeUrl);

  if (tree.truncated) {
    console.warn("Warning: GitHub tree response was truncated. Results may be incomplete.");
  }

  const matchingFiles = tree.tree
    .filter((entry) => entry.type === "blob")
    .filter((entry) => shouldKeepFile(entry.path, options.prefixes))
    .slice(0, options.limit);

  console.log(`Found ${matchingFiles.length} matching JSON files.`);

  if (matchingFiles.length === 0) {
    console.log("Nothing to download. Try widening --prefix.");
    return;
  }

  for (const entry of matchingFiles) {
    console.log(entry.path);
  }

  if (options.dryRun) {
    return;
  }

  for (const entry of matchingFiles) {
    const rawUrl = toRawUrl(options.repo, options.branch, entry.path);
    const targetPath = path.resolve(options.outDir, entry.path);

    await mkdir(path.dirname(targetPath), { recursive: true });
    const contents = await fetchText(rawUrl);
    await writeFile(targetPath, contents, "utf8");
  }

  console.log(`Saved files under ${path.resolve(options.outDir)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
