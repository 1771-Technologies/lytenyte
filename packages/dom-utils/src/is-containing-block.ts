import { isElement } from "./is-element.js";
import { isWebKit } from "./is-webkit.js";

export function isContainingBlock(elementOrCss: Element | CSSStyleDeclaration): boolean {
  const webkit = isWebKit();
  const css = isElement(elementOrCss) ? getComputedStyle(elementOrCss) : elementOrCss;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  // https://drafts.csswg.org/css-transforms-2/#individual-transforms
  return (
    ["transform", "translate", "scale", "rotate", "perspective"].some((value) =>
      /* v8 ignore next 4 */
      css[value as keyof CSSStyleDeclaration]
        ? css[value as keyof CSSStyleDeclaration] !== "none"
        : false,
    ) ||
    /* v8 ignore next 3 */
    (css.containerType ? css.containerType !== "normal" : false) ||
    (!webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false)) ||
    (!webkit && (css.filter ? css.filter !== "none" : false)) ||
    ["transform", "translate", "scale", "rotate", "perspective", "filter"].some((value) =>
      (css.willChange || "").includes(value),
    ) ||
    ["paint", "layout", "strict", "content"].some((value) => (css.contain || "").includes(value))
  );
}
