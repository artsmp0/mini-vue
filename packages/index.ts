import { compile } from "./compiler-dom";
import { registerRuntimeCompiler } from "./runtime-core/component";
import * as runtimeDom from "./runtime-dom";

function compileToFunction(template: string) {
  const code = compile(template);
  return new Function("MiniVue", code)(runtimeDom);
}

registerRuntimeCompiler(compileToFunction);

export * from "./runtime-core";
export * from "./runtime-dom";
export * from "./reactivity";
