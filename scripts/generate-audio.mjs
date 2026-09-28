import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const episodesPath = path.join(root, "src/data/episodes.ts");
const outDir = path.join(root, "public/audio");

const src = fs.readFileSync(episodesPath, "utf8");
const blocks = [...src.matchAll(/(?:"([^"]+)"|([a-z0-9-]+)):\s*\{[\s\S]*?narrationScript:\s*\n\s+"([\s\S]*?)",/g)];

fs.mkdirSync(outDir, { recursive: true });

for (const [, quoted, bare, text] of blocks) {
  const id = quoted || bare;
  const clean = text.replace(/\\n/g, " ").replace(/\s+/g, " ").trim();
  const out = path.join(outDir, `${id}.wav`);
  execFileSync("espeak-ng", ["-v", "pt", "-s", "150", "-w", out, clean], { stdio: "inherit" });
  console.log("✓", id);
}

console.log(`\n${blocks.length} episódios em public/audio/`);
