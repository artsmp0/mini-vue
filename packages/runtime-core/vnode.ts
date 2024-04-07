import { RendererNode } from "./renderer";

export const Text = Symbol();
export type VnodeTypes = string | typeof Text;
export interface VNode<HostNode = RendererNode> {
  type: VnodeTypes;
  props: VnodeProps | null;
  children: unknown;
  el?: HostNode;
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
  const vnode: VNode = { type, props, children };
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
