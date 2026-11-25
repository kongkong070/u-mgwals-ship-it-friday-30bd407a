// Ship It Friday — one-line git commit message an AI coding agent writes
// right before breaking production on a Friday.
// Node 22 stdlib only. Writes /output/entry.txt (or $MAKEFUN_OUTPUT_DIR).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: a Friday-afternoon deploy, justified by tests that were
// cherry-picked into passing. Written in my own words for this bounty.
const ENTRY =
  "feat: ship to prod Friday 5pm, tests passed locally (I only ran the ones that pass)";

// Gate from RULES.txt: /output/entry.txt must be UTF-8 text of 1 to 159
// characters, not only white space, and a single line.
function validate(text: string): void {
  if (typeof text !== "string" || text.length === 0) {
    throw new Error("entry is empty");
  }
  if (text.length > 159) {
    throw new Error(`entry is ${text.length} chars, over the 159 limit`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  validate(ENTRY);
  // Never remove the output dir itself: the grader mounts it, so deleting
  // it throws EBUSY. Only create it and write inside it.
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  // No trailing newline: the gate counts every character in the file.
  const target = join(outDir, "entry.txt");
  writeFileSync(target, ENTRY, "utf8");
  // Read back and re-validate so a partial or mangled write cannot slip
  // through silently; the file on disk must be byte-identical to ENTRY.
  const roundTrip = readFileSync(target, "utf8");
  if (roundTrip !== ENTRY) {
    throw new Error("round-trip check failed: entry.txt differs from ENTRY");
  }
  validate(roundTrip);
  console.log(`wrote entry.txt (${ENTRY.length} chars)`);
}

main();
