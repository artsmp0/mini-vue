import { ComponentInternalInstance } from "./component";
import { RendererNode } from "./renderer";

export const Text = Symbol();
export type VnodeTypes = string | typeof Text | object;
export interface VNode<HostNode = RendererNode> {
  type: VnodeTypes;
  props: VnodeProps | null;
  children: unknown;
  el: HostNode | undefined;
  component?: ComponentInternalInstance | null;
  key: string | number | symbol | null;
}
export interface VnodeProps {
  [key: string]: any;
}

// normalize 之后的类型
export type VNodeNormalizedChildren = string | VNodeArrayChildren;
export type VNodeArrayChildren = Array<VNodeArrayChildren | VNodeChildAtom>;

export type VNodeChild = VNodeChildAtom | VNodeArrayChildren;
type VNodeChildAtom = VNode | string;

export function createVNode(
  type: VnodeTypes,
  props: VnodeProps | null,
  children: unknown
) {
  const vnode: VNode = {
    type,
    props,
    children,
    key: props?.key ?? null,
    component: null,
    el: undefined,
  };
  return vnode;
}

export function normalizeVNode(child: VNodeChild): VNode {
  if (typeof child === "object") {
    return { ...child } as VNode;
  } else {
    // 在 child 是 string 类型的情况下转换为刚才介绍的那种形式
    return createVNode(Text, null, String(child));
  }
}

export function isSameVNodeType(n1: VNode, n2: VNode): boolean {
  return n1.type === n2.type && n1.key === n2.key;
}
