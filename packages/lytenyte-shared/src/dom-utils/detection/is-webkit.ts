/** Returns true if the current browser is WebKit-based, detected via CSS.supports. */
export const isWebKit = () => {
  return typeof CSS === "undefined" || !CSS.supports ? false : CSS.supports("-webkit-backdrop-filter:none");
};
