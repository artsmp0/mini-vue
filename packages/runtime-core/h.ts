import { VNode, VnodeProps, createVNode } from "./vnode";

export function h(
  type: string | object,
  props: VnodeProps,
  children: (VNode | string)[]
) {
  return createVNode(type, props, children);
}
