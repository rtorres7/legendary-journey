import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import ckeditor5 from "@ckeditor/vite-plugin-ckeditor5";
import vue from "@vitejs/plugin-vue";
import istanbul from 'vite-plugin-istanbul';

// https://vitejs.dev/config/
export default defineConfig({
  //TODO: Move this outside of src, along with other files after refactoring high side
  envDir: "./src/env",
  plugins: [
    vue(),
    ckeditor5({ theme: require.resolve("@ckeditor/ckeditor5-theme-lark") }),
    istanbul({
      include: 'src/*',
      exclude: ['node_modules', 'tests/'],
      extension: ['.js', '.ts', '.vue'],
      requireEnv: false
    })
  ],
  resolve: {
    alias: [
      {
        // this is required for the SCSS modules
        find: /^~(.*)$/,
        replacement: "$1",
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
      {
        find: "@current",
        replacement: fileURLToPath(
          new URL("./src/domains/current", import.meta.url)
        ),
      },
      {
        find: "@studio",
        replacement: fileURLToPath(
          new URL("./src/domains/studio", import.meta.url)
        ),
      },
      {
        find: "@workspace",
        replacement: fileURLToPath(
          new URL("./src/domains/workspace", import.meta.url)
        ),
      },
    ],
  },
  server: {
    host: true,
    port: 8080,
    watch: {
      usePolling: true,
    },
  },
  test: {
    environment: "happy-dom",
  },
});
