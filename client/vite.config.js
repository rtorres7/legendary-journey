import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

import { defineConfig } from "vite";
import ckeditor5 from "@ckeditor/vite-plugin-ckeditor5";
import vue from "@vitejs/plugin-vue";
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  //TODO: Move this outside of src, along with other files after refactoring high side
  envDir: "./src/env",
  plugins: [
    vue(),
    ckeditor5({ theme: require.resolve("@ckeditor/ckeditor5-theme-lark") }),
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
        replacement: path.resolve(__dirname, "./src"),
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
});
