import { RendererOptions } from "../runtime-core/renderer";

export const nodeOps: Omit<RendererOptions<Node>, "patchProp"> = {
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText(node, text) {
    node.textContent = text;
  },

  createElement(type) {
    return document.createElement(type);
  },
  createText(text) {
    return document.createTextNode(text);
  },
  insert(child, parent, anchor) {
    parent.insertBefore(child, anchor || null);
  },
  parentNode(node) {
    return node.parentNode;
  },
  remove(node) {
    const parent = node.parentNode;
    if (parent) {
      parent.removeChild(node);
    }
  },
};
