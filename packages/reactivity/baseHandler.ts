import { track, trigger } from "./effect";
import { reactive } from "./reactive";

export const mutableHandlers: ProxyHandler<object> = {
  get(target, p, receiver) {
    track(target, p);
    const res = Reflect.get(target, p, receiver);
    if (res !== null && typeof res === "object") {
      return reactive(res);
    }

    return res;
  },

  set(target, p, value, receiver) {
    let oldValue = (target as any)[p];
    Reflect.set(target, p, value, receiver);
    if (hasChanged(value, oldValue)) {
      trigger(target, p);
    }
    return true;
  },
};

const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue);
