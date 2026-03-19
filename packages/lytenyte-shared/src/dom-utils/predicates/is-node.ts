/** Returns true if the value is a DOM Node, identified by the presence of a nodeType property. */
export const isNode = (el: any): el is Node =>
  typeof el === "object" && el != null && el.nodeType !== undefined;
