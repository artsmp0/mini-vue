import { ReactiveEffect } from "../reactivity/effect";
import { emit } from "./componentEmits";
import { ComponentOptions } from "./componentOptions";
import { Props, initProps } from "./componentProps";
import { VNode, VNodeChild } from "./vnode";

export type Component = ComponentOptions;

export interface ComponentInternalInstance {
  uid: number;
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
  setupState: Data; // 如果 setup 的返回结果是对象，则存储在这里
}

export interface InternalRenderFunction {
  (ctx: Data): VNodeChild;
}

export type Data = Record<string, unknown>;
let uid = 0;
export function createComponentInstance(
  vnode: VNode
): ComponentInternalInstance {
  const type = vnode.type as Component;
  const instance: ComponentInternalInstance = {
    uid: uid++,
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
    setupState: null!,
  };
  instance.emit = emit.bind(null, instance);
  return instance;
}

type CompileFunction = (template: string) => InternalRenderFunction;
let compile: CompileFunction | undefined;

export function registerRuntimeCompiler(_compile: any) {
  compile = _compile;
}

export function setupComponent(instance: ComponentInternalInstance) {
  const { props } = instance.vnode;
  initProps(instance, props);
  const component = instance.type as Component;
  if (component.setup) {
    const setupResult = component.setup(instance.props, {
      emit: instance.emit,
    }) as InternalRenderFunction;
    if (typeof setupResult === "function") {
      instance.render = setupResult;
    } else if (typeof setupResult === "object") {
      instance.setupState = setupResult;
    }
  }

  if (compile && !component.render) {
    const template = component.template ?? "";
    if (template) {
      console.log("compile: ", compile);
      instance.render = compile(template);
    }
  }

  const { render } = component;
  if (render) {
    instance.render = render as InternalRenderFunction;
  }
}
