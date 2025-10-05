export const isNode = (el: any): el is Node =>
  typeof el === "object" && el != null && el.nodeType !== undefined;
