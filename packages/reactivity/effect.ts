import { Dep, createDep } from "./dep";

export let activeEffect: ReactiveEffect | undefined;

type KeyToDepMap = Map<any, Dep>;
const targetMap = new WeakMap<object, KeyToDepMap>();

export type EffectSchedular = (...args: any[]) => any;

export class ReactiveEffect<T = any> {
  constructor(
    public fn: () => T,
    public schedular: EffectSchedular | null = null
  ) {}

  run() {
    let parent: ReactiveEffect | undefined = activeEffect;
    activeEffect = this;
    const res = this.fn();
    activeEffect = parent;
    return res;
  }
}

export function track(target: object, key: unknown) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = createDep()));
  }

  if (activeEffect) {
    dep.add(activeEffect);
  }
}

export function trigger(target: object, key?: unknown) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const dep = depsMap.get(key);
  if (dep) {
    const effects = [...dep];
    for (const effect of effects) {
      if (effect.schedular) {
        effect.schedular();
      } else {
        effect.run();
      }
    }
  }
}
