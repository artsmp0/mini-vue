import { RendererOptions } from "../runtime-core";
import { VNode } from "../runtime-core/vnode";
import { patchAttr } from "./modules/attrs";
import { patchEvent } from "./modules/events";

type DOMRendererOptions = RendererOptions<VNode, Element>;

const onRE = /^on[^a-z]/;
export const isOn = (key: string) => onRE.test(key);

export const patchProp: DOMRendererOptions["patchProp"] = (el, key, value) => {
  if (isOn(key)) {
    // patchEvent
    patchEvent(el, key, value);
  } else {
    // patchAttr
    patchAttr(el, key, value);
  }
};
