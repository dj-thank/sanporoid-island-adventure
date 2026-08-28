import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  root: resolve("native"),
  publicDir: resolve("public"),
  base: "./",
  define: {
    CESIUM_BASE_URL: JSON.stringify("/cesiumStatic"),
    "import.meta.env.VITE_NATIVE_APP": JSON.stringify("true"),
  },
  plugins: [react()],
  optimizeDeps: { exclude: ["maplibre-gl"] },
  build: {
    outDir: resolve("native-dist"),
    emptyOutDir: true,
    target: "es2022",
  },
});
