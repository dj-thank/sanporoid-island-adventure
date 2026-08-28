import { copyFile, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const outputRoot = resolve("native-dist");
const textExtensions = new Set([".css", ".html", ".js", ".json", ".webmanifest"]);
const publicPathPattern = /([`"'])\/(sanporoid|photos|cesiumStatic)(?=\/|[`"'])/g;

async function collectFiles(directory) {
  const entries = await readdir(directory);
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry);
    if ((await stat(path)).isDirectory()) files.push(...await collectFiles(path));
    else files.push(path);
  }
  return files;
}

await rm(join(outputRoot, "sw.js"), { force: true });
const files = await collectFiles(outputRoot);
for (const file of files) {
  const extension = file.slice(file.lastIndexOf("."));
  if (!textExtensions.has(extension)) continue;
  const source = await readFile(file, "utf8");
  const portable = source.replace(publicPathPattern, "$1./$2");
  if (portable !== source) await writeFile(file, portable, "utf8");
}

for (const required of ["index.html", "install.webmanifest", "install-sw.js", "shioboshi-icon-180.png", "shioboshi-icon-192.png", "shioboshi-icon-512.png"]) {
  await stat(join(outputRoot, required));
}

const builtIndex = await readFile(join(outputRoot, "index.html"), "utf8");
if (!builtIndex.includes("./install.webmanifest") || !builtIndex.includes("./assets/")) {
  throw new Error("GitHub Pages index is missing relative install assets");
}

const builtScripts = (await Promise.all((await collectFiles(join(outputRoot, "assets")))
  .filter((file) => file.endsWith(".js"))
  .map((file) => readFile(file, "utf8")))).join("\n");
if (/([`"'])\/(sanporoid|photos|cesiumStatic)(?=\/|[`"'])/.test(builtScripts)) {
  throw new Error("GitHub Pages bundle still contains root-absolute public asset paths");
}

await copyFile(join(outputRoot, "index.html"), join(outputRoot, "404.html"));
await writeFile(join(outputRoot, ".nojekyll"), "", "utf8");
console.log("GitHub Pages install bundle is ready");
