import { isArray, isString } from "../../shared";

type Style = string | Record<string, string | string[]>;

export const patchStyle = (el: Element, prev: Style, next: Style) => {
  const style = (el as HTMLElement).style;
  const isCssString = isString(next);
  if (!isCssString && next) {
    if (prev && !isString(prev)) {
      for (const key in prev) {
        if (next[key] == null) {
          setStyle(style, key, "");
        }
      }
    }
    for (const key in next) {
      setStyle(style, key, next[key]);
    }
  } else {
    if (isCssString) {
      if (prev !== next) {
        style.cssText = next;
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
  }
};

function setStyle(
  style: CSSStyleDeclaration,
  name: string,
  value: string | string[]
) {
  if (isArray(value)) {
    value.forEach((v) => setStyle(style, name, v));
  } else {
    if (name.startsWith("--")) {
      style.setProperty(name, value);
    } else {
      style[name as any] = value;
    }
  }
}
