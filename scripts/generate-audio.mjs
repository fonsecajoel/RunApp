import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const poisPath = path.join(root, "src/data/pois.ts");
const outDir = path.join(root, "public/audio");

const src = fs.readFileSync(poisPath, "utf8");
const blocks = src.split(/\n  \{\n/).slice(1);
const pois = [];

for (const block of blocks) {
  const id = block.match(/id: "([^"]+)"/)?.[1];
  const storyTitle = block.match(/storyTitle: "([^"]+)"/)?.[1];
  const story = block.match(/story:\n\s+"([^"]+)"/)?.[1];
  if (id && storyTitle && story) {
    pois.push({ id, text: `${storyTitle}. ${story}` });
  }
}

fs.mkdirSync(outDir, { recursive: true });

for (const { id, text } of pois) {
  const out = path.join(outDir, `${id}.wav`);
  execFileSync(
    "espeak-ng",
    ["-v", "pt", "-s", "155", "-w", out, text],
    { stdio: "inherit" }
  );
  console.log("✓", id);
}

console.log(`\n${pois.length} ficheiros em public/audio/`);
