import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";
import { team } from "../src/team-data.js";

const root = new URL("../", import.meta.url);
const assetRoot = new URL("public/assets/", root);
const files = new Set(
  (await readdir(assetRoot, { recursive: true, withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .map((entry) =>
      relative(fileURLToPath(assetRoot), join(entry.parentPath, entry.name))
        .split("\\").join("/").normalize("NFC"),
    ),
);
const references = new Set(team.map((person) => person[3]));
const sources = [
  "index.html",
  "src/main.jsx",
  "src/shared.jsx",
  "src/image-switcher.jsx",
  "src/design-lab.jsx",
  "src/design-previews.jsx",
  "src/content.json",
  "src/legal.json",
  "src/fonts.css",
  "src/modern.css",
  "src/design-lab.css",
];

for (const source of sources) {
  const text = await readFile(new URL(source, root), "utf8");
  for (const match of text.matchAll(/["'`](\/assets\/[^"'`\n]+)["'`]/g)) {
    references.add(match[1].slice("/assets/".length));
  }
  for (const match of text.matchAll(/url\(["']?(\/assets\/[^)"']+)["']?\)/g)) {
    references.add(match[1].slice("/assets/".length));
  }
  if (source === "src/main.jsx") {
    for (const match of text.matchAll(/\bimage:\s*["']([^"']+)["']/g)) {
      references.add(match[1]);
    }
  }
}

const missing = [...references].filter((reference) => {
  const filename = decodeURIComponent(reference.split(/[?#]/)[0]).normalize("NFC");
  return !files.has(filename);
});
if (missing.length) {
  console.error("Missing assets or filename case mismatch:\n" + missing.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Verified ${references.size} local asset references, including filename case.`);
}
