import { toHandlerKey } from "../shared/general";
import {
  AttributeNode,
  DirectiveNode,
  ElementNode,
  InterpolationNode,
  NodeTypes,
  TemplateChildNode,
  TextNode,
} from "./ast";
import { CompilerOptions } from "./options";

export const generate = (
  { children }: { children: TemplateChildNode[] },
  options: Required<CompilerOptions>
) => {
  return `${options.isBrowser ? "return " : ""}function render(_ctx){
    ${options.isBrowser ? "with(_ctx) {" : ""}
      const { h } = MiniVue;
      return ${genNode(children[0], options)}
    ${options.isBrowser ? "}" : ""}
  }`;
};

const genNode = (
  node: TemplateChildNode,
  options: Required<CompilerOptions>
) => {
  switch (node.type) {
    case NodeTypes.ELEMENT:
      return genElement(node, options);

    case NodeTypes.TEXT:
      return genText(node);

    case NodeTypes.INTERPOLATION:
      return genInterpolation(node, options);

    default:
      break;
  }
};

const genText = (text: TextNode) => {
  return `\`${text.content}\``;
};

const genInterpolation = (
  node: InterpolationNode,
  options: Required<CompilerOptions>
): string => {
  return `${options.isBrowser ? "" : "_ctx."}${node.content}`;
};

const genElement = (
  el: ElementNode,
  options: Required<CompilerOptions>
): string => {
  return `h("${el.tag}", {${el.props
    .map((prop) => genProp(prop, options))
    .join(", ")}}, [${el.children
    .map((it) => genNode(it, options))
    .join(", ")}])`;
};

const genProp = (
  prop: AttributeNode | DirectiveNode,
  options: Required<CompilerOptions>
): string => {
  switch (prop.type) {
    case NodeTypes.ATTRIBUTE:
      return `${prop.name}: "${prop.value?.content}"`;
    case NodeTypes.DIRECTIVE: {
      switch (prop.name) {
        case "on":
          return `${toHandlerKey(prop.arg)}: ${
            options.isBrowser ? "" : "_ctx."
          }${prop.exp}`;
        default:
          // TODO: other directives
          throw new Error(`unexpected directive name. got "${prop.name}"`);
      }
    }
    default:
      throw new Error(`unexpected prop type.`);
  }
};
