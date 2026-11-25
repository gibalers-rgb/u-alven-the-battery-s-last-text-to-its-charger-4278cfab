// The Battery's Last Text to Its Charger — entrypoint (Node 22, stdlib only).
// Writes one line of plain text to /output/entry.txt: the phone battery's
// final message to the charger it waited for all day.
//
// The joke: the battery is not just dying, it is being cheated on. The
// charger came home and plugged in everything else first — the AirPods,
// the vape, the watch — and only now, at 1%, does the battery get to
// speak. The text itself dies mid-word ("tell mom i lov—"), so the
// punchline is the battery running out of charge halfway through its own
// goodbye. Every item named is something a charger actually charges: the
// joke has to survive a second read, not just a first laugh.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ENTRY =
  'waited all day for you. you came home and charged the airpods, your ' +
  'vape, your watch — everything but me. now i\'m at 1% writing my will ' +
  'in the notes app. tell mom i lov—';

const MAX_CHARS = 200;

// The gate counts characters, not UTF-16 code units or bytes: count code
// points so a multi-byte character (the em dash) is never miscounted.
function charCount(text: string): number {
  return [...text].length;
}

function validateEntry(text: string): void {
  const n = charCount(text);
  if (n < 1 || n > MAX_CHARS) {
    throw new Error(`entry is ${n} chars, must be 1–${MAX_CHARS}`);
  }
  if (text.trim().length === 0) {
    throw new Error('entry must not be only white space');
  }
  if (text.includes('\n') || text.includes('\r')) {
    throw new Error('entry must be a single line');
  }
  // The punchline is the battery dying mid-word; if the text ever ended
  // with a finished sentence, the joke would lose its payoff.
  if (!text.endsWith('lov—')) {
    throw new Error('entry must end cut off mid-word (lov—)');
  }
}

function main(): void {
  validateEntry(ENTRY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'entry.txt'), ENTRY, 'utf8');
  console.log(`wrote entry.txt (${charCount(ENTRY)} chars)`);
}

main();
