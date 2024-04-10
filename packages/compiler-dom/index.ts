import { baseCompile } from "../compiler-core";
import { CompilerOptions } from "../compiler-core/options";
import { baseParse } from "../compiler-core/parse";

export function compile(template: string, options?: CompilerOptions) {
  const defaultOptions: Required<CompilerOptions> = { isBrowser: true };
  if (options) Object.assign(defaultOptions, options);
  return baseCompile(template, defaultOptions);
}

export function parse(template: string) {
  return baseParse(template);
}
