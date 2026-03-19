/** Returns true if the value is a VisualViewport instance. */
export function isVisualViewport(el: any): el is VisualViewport {
  return !!(typeof el === "object" && el && el.constructor.name === "VisualViewport");
}
