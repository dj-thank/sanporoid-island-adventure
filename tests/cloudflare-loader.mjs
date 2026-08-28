import { access, readFile } from "node:fs/promises";

const cloudflareWorkersStub = `
export const env = new Proxy({}, {
  get(_target, key) {
    return globalThis.__testCloudflareEnv?.[key];
  },
});
`;

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "cloudflare:workers") {
    return {
      shortCircuit: true,
      url: `data:text/javascript,${encodeURIComponent(cloudflareWorkersStub)}`,
    };
  }
  if (specifier.startsWith(".") && !/\.[a-z0-9]+$/i.test(specifier) && context.parentURL?.startsWith("file:")) {
    for (const extension of [".ts", ".tsx"]) {
      const candidate = new URL(`${specifier}${extension}`, context.parentURL);
      try {
        await access(candidate);
        return { shortCircuit: true, url: candidate.href };
      } catch { /* Try the next supported TypeScript extension. */ }
    }
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.endsWith(".json")) {
    const json = await readFile(new URL(url), "utf8");
    return { format: "module", shortCircuit: true, source: `export default ${json};` };
  }
  return nextLoad(url, context);
}
