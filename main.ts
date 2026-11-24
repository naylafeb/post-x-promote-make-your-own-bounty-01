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

const checkoutRoot = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const handInFolder = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

async function deliver() {
  const sourceFile = resolve(checkoutRoot, "POST.json");
  const targetFile = resolve(handInFolder, "POST.json");

  await mkdir(handInFolder, { recursive: true });

  try {
    await copyFile(sourceFile, targetFile);
  } catch (problem) {
    const reason = problem instanceof Error ? problem.message : String(problem);
    console.error(`Could not deliver POST.json (${sourceFile} -> ${targetFile}): ${reason}`);
    process.exit(1);
  }
}

await deliver();
