import { ElementNode, NodeTypes, TemplateChildNode, TextNode } from "./ast";

export const generate = ({ children }: { children: TemplateChildNode[] }) => {
  console.log("children: ", children);
  return `return function render(){
    const { h } = MiniVue;
    return ${genNode(children[0])}
  }`;
};

const genNode = (node: TemplateChildNode) => {
  switch (node.type) {
    case NodeTypes.ELEMENT:
      return genElement(node);

    case NodeTypes.TEXT:
      return genText(node);

    default:
      break;
  }
};

const genText = (text: TextNode) => {
  return `\`${text.content}\``;
};

const genElement = (el: ElementNode): string => {
  return `h("${el.tag}", {${el.props
    .map(({ name, value }) => `${name}: "${value?.content}"`)
    .join(", ")}}, [${el.children.map((it) => genNode(it)).join(", ")}])`;
};
