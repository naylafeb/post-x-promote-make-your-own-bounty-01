// This entry is a post on X that already exists. All this script does is
// hand its address over to the grader: it takes the POST.json sitting next
// to the repository checkout and places an identical copy where the grader
// looks for it. It never opens the post, never checks what it says, and
// never decides anything about it — delivery only.
//
// The two folders it works with come from the environment when set, and
// fall back to the usual container paths when they are not:
//   MAKEFUN_BOT_DIR     — where the checkout lives (default /bot)
//   MAKEFUN_OUTPUT_DIR  — where the copy goes (default /output)

import { copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const FILE_NAME = "POST.json";

interface JobPaths {
  sourcePath: string;
  destinationPath: string;
  destinationDir: string;
}

function readFoldersFromEnv(): { botDir: string; outputDir: string } {
  return {
    botDir: process.env.MAKEFUN_BOT_DIR ?? "/bot",
    outputDir: process.env.MAKEFUN_OUTPUT_DIR ?? "/output",
  };
}

function resolveSourcePath(botDir: string): string {
  return resolve(botDir, FILE_NAME);
}

function resolveDestination(outputDir: string): {
  destinationPath: string;
  destinationDir: string;
} {
  return {
    destinationPath: resolve(outputDir, FILE_NAME),
    destinationDir: outputDir,
  };
}

function resolvePaths(botDir: string, outputDir: string): JobPaths {
  return {
    sourcePath: resolveSourcePath(botDir),
    ...resolveDestination(outputDir),
  };
}

async function ensureOutputDir(destinationDir: string): Promise<void> {
  await mkdir(destinationDir, { recursive: true });
}

async function copyPostFile(sourcePath: string, destinationPath: string): Promise<void> {
  await copyFile(sourcePath, destinationPath);
}

function describeFailure(error: unknown, paths: JobPaths): string {
  const reason = error instanceof Error ? error.message : String(error);
  return `Could not deliver POST.json (${paths.sourcePath} -> ${paths.destinationPath}): ${reason}`;
}

async function run(): Promise<void> {
  const { botDir, outputDir } = readFoldersFromEnv();
  const paths = resolvePaths(botDir, outputDir);

  await ensureOutputDir(paths.destinationDir);

  try {
    await copyPostFile(paths.sourcePath, paths.destinationPath);
  } catch (error) {
    console.error(describeFailure(error, paths));
    process.exit(1);
  }
}

await run();
