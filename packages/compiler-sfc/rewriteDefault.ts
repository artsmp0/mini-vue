import { parse } from "@babel/parser";
import MagicString from "magic-string";

const defaultExportRE = /((?:^|\n|;)\s*)export(\s*)default/;
const namedDefaultExportRE = /((?:^|\n|;)\s*)export(.+)(?:as)?(\s*)default/s;

export function rewriteDefault(input: string, as: string): string {
  if (!hasDefaultExport(input)) {
    return input + `\nconst ${as} = {}`;
  }

  const s = new MagicString(input);
  const ast = parse(input, {
    sourceType: "module",
  }).program.body;

  ast.forEach((node) => {
    // 具有 default export 的情况
    if (node.type === "ExportDefaultDeclaration") {
      if (node.declaration.type === "ClassDeclaration") {
        // 如果是 `export default class Hoge {}`，则替换为 `class Hoge {}`
        s.overwrite(node.start!, node.declaration.id?.start!, "class ");
        // 在此基础上，在末尾追加 `const ${as} = Hoge;` 代码就可以了。
        s.append(`\nconst ${as} = ${node.declaration.id!.name}`);
      } else {
        // 除此之外，将 default export 部分替换为变量声明即可。
        // eg 1) `export default { setup() {}, }`  ->  `const ${as} = { setup() {}, }`
        // eg 2) `export default Hoge`  ->  `const ${as} = Hoge`
        s.overwrite(node.start!, node.declaration.start!, `const ${as} = `);
      }
    }

    // 在具名导出的情况下，也可能存在默认导出
    // 主要有以下三种情况
    //   1. `export { default } from "source";` 的情况
    //   2. `export { hoge as default }` from 'source' 的情况
    //   3. `export { hoge as default }` 的情况
    if (node.type === "ExportNamedDeclaration") {
      for (const specifier of node.specifiers) {
        if (
          specifier.type === "ExportSpecifier" &&
          specifier.exported.type === "Identifier" &&
          specifier.exported.name === "default"
        ) {
          // 如果有 `from` 关键字
          if (node.source) {
            if (specifier.local.name === "default") {
              // 1. `export { default } from "source";` 的情况
              // 在这种情况下，需要将其提取到导入语句中并为其重新命名，然后将其绑定到最终的 `as` 变量。
              // eg) `export { default } from "source";`
              // ->  `import { default as __VUE_DEFAULT__ } from 'source'; const ${as} = __VUE_DEFAULT__`
              const end = specifierEnd(input, specifier.local.end!, node.end!);
              s.prepend(
                `import { default as __VUE_DEFAULT__ } from '${node.source.value}'\n`
              );
              s.overwrite(specifier.start!, end, ``);
              s.append(`\nconst ${as} = __VUE_DEFAULT__`);
              continue;
            } else {
              // 2. `export { hoge as default }` from 'source' 的情况
              // 在这种情况下，需要按照导入语句中的方式重写所有变量标识符，并将作为 default 默认值的变量绑定到最终的 `as` 变量。
              // eg) `export { hoge as default } from "source";`
              // ->  `import { hoge } from 'source'; const ${as} = hoge
              const end = specifierEnd(
                input,
                specifier.exported.end!,
                node.end!
              );
              s.prepend(
                `import { ${input.slice(
                  specifier.local.start!,
                  specifier.local.end!
                )} } from '${node.source.value}'\n`
              );

              // 3. `export { hoge as default }` 的情况
              // 在这种情况下，我们只需要简单地把默认变量绑定到最终的 `as` 变量
              s.overwrite(specifier.start!, end, ``);
              s.append(`\nconst ${as} = ${specifier.local.name}`);
              continue;
            }
          }
          const end = specifierEnd(input, specifier.end!, node.end!);
          s.overwrite(specifier.start!, end, ``);
          s.append(`\nconst ${as} = ${specifier.local.name}`);
        }
      }
    }
  });

  return s.toString();
}

// 计算声明语句的结尾位置
function specifierEnd(
  input: string,
  end: number,
  nodeEnd: number | null
): number {
  // export { default   , foo } ...
  let hasCommas = false;
  let oldEnd = end;
  while (end < nodeEnd!) {
    if (/\s/.test(input.charAt(end))) {
      end++;
    } else if (input.charAt(end) === ",") {
      end++;
      hasCommas = true;
      break;
    } else if (input.charAt(end) === "}") {
      break;
    }
  }
  return hasCommas ? end : oldEnd;
}

export function hasDefaultExport(input: string): boolean {
  return defaultExportRE.test(input) || namedDefaultExportRE.test(input);
}
