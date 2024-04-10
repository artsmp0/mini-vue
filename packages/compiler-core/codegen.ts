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

export const generate = ({ children }: { children: TemplateChildNode[] }) => {
  return `return function render(_ctx){
    with(_ctx) {
      const { h } = MiniVue;
      return ${genNode(children[0])}
    }
  }`;
};

const genNode = (node: TemplateChildNode) => {
  switch (node.type) {
    case NodeTypes.ELEMENT:
      return genElement(node);

    case NodeTypes.TEXT:
      return genText(node);

    case NodeTypes.INTERPOLATION:
      return genInterpolation(node);

    default:
      break;
  }
};

const genText = (text: TextNode) => {
  return `\`${text.content}\``;
};

const genInterpolation = (node: InterpolationNode): string => {
  return `${node.content}`;
};

const genElement = (el: ElementNode): string => {
  return `h("${el.tag}", {${el.props
    .map((prop) => genProp(prop))
    .join(", ")}}, [${el.children.map((it) => genNode(it)).join(", ")}])`;
};

const genProp = (prop: AttributeNode | DirectiveNode): string => {
  switch (prop.type) {
    case NodeTypes.ATTRIBUTE:
      return `${prop.name}: "${prop.value?.content}"`;
    case NodeTypes.DIRECTIVE: {
      switch (prop.name) {
        case "on":
          return `${toHandlerKey(prop.arg)}: ${prop.exp}`;
        default:
          // TODO: other directives
          throw new Error(`unexpected directive name. got "${prop.name}"`);
      }
    }
    default:
      throw new Error(`unexpected prop type.`);
  }
};
