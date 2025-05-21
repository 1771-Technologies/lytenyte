export const sortOrderedTabbables = function (
  a: { tabIndex: number; documentOrder: number },
  b: { tabIndex: number; documentOrder: number }
) {
  return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
};
