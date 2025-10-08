import { getNearestMatching } from "../../dom-utils/index.js";

export function isCell(el: HTMLElement, gridId: string) {
  return (
    el.getAttribute("data-ln-cell") === "true" &&
    getNearestMatching(el, (c) => c.getAttribute("data-ln-viewport") === "true")?.getAttribute(
      "data-ln-gridid",
    ) === gridId
  );
}
