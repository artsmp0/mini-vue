import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "mini-vue": path.resolve(__dirname, "../../packages"),
    },
  },
});
