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
  return nextResolve(specifier, context);
}
