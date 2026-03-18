export function isVisualViewport(el: any): el is VisualViewport {
  return !!(typeof el === "object" && el && el.constructor.name === "VisualViewport");
}
