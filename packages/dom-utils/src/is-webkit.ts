export const isWebKit = () => {
  return typeof CSS === "undefined" || !CSS.supports
    ? false
    : CSS.supports("-webkit-backdrop-filter:none");
};
