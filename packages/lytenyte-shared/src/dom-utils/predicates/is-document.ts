const DOCUMENT_NODE: typeof Node.DOCUMENT_NODE = 9;

export const isDocument = (el: any): el is Document =>
  typeof el === "object" && el != null && el.nodeType === DOCUMENT_NODE;
