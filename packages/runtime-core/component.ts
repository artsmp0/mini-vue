import { ReactiveEffect } from "../reactivity/effect";
import { emit } from "./componentEmits";
import { ComponentOptions } from "./componentOptions";
import { Props } from "./componentProps";
import { RootRenderFunction } from "./renderer";
import { VNode, VNodeChild } from "./vnode";

export type Component = ComponentOptions;

export interface ComponentInternalInstance {
  type: Component;
  vnode: VNode;
  subTree: VNode; // 原 n1
  next: VNode | null; // 原 n2
  effect: ReactiveEffect; // 原 effect
  render: InternalRenderFunction; // 原 componentRender
  update: () => void; // 原 updateComponent 函数
  isMounted: boolean;
  propsOptions: Props;
  props: Data;
  emit: (event: string, ...args: any[]) => void;
}

export interface InternalRenderFunction {
  (): VNodeChild;
}

export type Data = Record<string, unknown>;

export function createComponentInstance(
  vnode: VNode
): ComponentInternalInstance {
  const type = vnode.type as Component;
  const instance: ComponentInternalInstance = {
    type,
    vnode,
    next: null!,
    effect: null!,
    subTree: null!,
    update: null!,
    render: null!,
    isMounted: false,
    propsOptions: type.props || {},
    props: {},
    emit: null!,
  };
  instance.emit = emit.bind(null, instance);
  return instance;
}
