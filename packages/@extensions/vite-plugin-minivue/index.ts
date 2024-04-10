import { createFilter, type Plugin } from "vite";
import fs from "node:fs";
import { parse } from "../../compiler-sfc";
import { compile } from "../../compiler-dom";
import { rewriteDefault } from "../../compiler-sfc/rewriteDefault";

export default function vitePluginMiniVue(): Plugin {
  const filter = createFilter(/\.vue$/);
  return {
    name: "vite:mini-vue",
    resolveId(id) {
      if (id.match(/\.vue\.css$/)) return id;
    },
    load(id) {
      if (id.match(/\.vue\.css$/)) {
        const filename = id.replace(/\.css$/, "");
        const content = fs.readFileSync(filename, "utf-8");
        const { descriptor } = parse(content, { filename });
        const styles = descriptor.styles.map((it) => it.content).join("\n");
        return { code: styles };
      }
    },
    transform(code, id, options) {
      if (!filter(id)) return;
      const outputs = [];
      outputs.push("import * as MiniVue from 'mini-vue'\n");

      const { descriptor } = parse(code, { filename: id });

      const SFC_MAIN = "_sfc_main";
      const scriptCode = rewriteDefault(
        descriptor.script?.content ?? "",
        SFC_MAIN
      );
      outputs.push(scriptCode);
      const templateCode = compile(descriptor.template?.content ?? "", {
        isBrowser: false,
      });
      outputs.push(templateCode);
      outputs.push("\n");
      outputs.push(`export default { ...${SFC_MAIN}, render }`);
      outputs.push(`import '${id}.css'`);
      return { code: outputs.join("\n") };
    },
  };
}
