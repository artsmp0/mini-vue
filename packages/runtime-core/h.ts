import { VNode, VnodeProps, createVNode } from "./vnode";

export function h(
  type: string,
  props: VnodeProps,
  children: (VNode | string)[]
) {
  return createVNode(type, props, children);
}
