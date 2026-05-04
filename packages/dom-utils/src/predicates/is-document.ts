const DOCUMENT_NODE: typeof Node.DOCUMENT_NODE = 9;

/** Returns true if the value is a Document node. */
export const isDocument = (el: any): el is Document =>
  typeof el === "object" && el != null && el.nodeType === DOCUMENT_NODE;
