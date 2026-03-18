export function isWindow(el: any): el is Window {
  return !!(el && typeof el === "object" && el === el.window);
}
