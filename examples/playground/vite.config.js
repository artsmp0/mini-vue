import path from "node:path";
import { defineConfig } from "vite";
import miniVue from "../../packages/@extensions/vite-plugin-minivue/index";

export default defineConfig({
  resolve: {
    alias: {
      "mini-vue": path.resolve(__dirname, "../../packages"),
    },
  },
  plugins: [miniVue()],
});
