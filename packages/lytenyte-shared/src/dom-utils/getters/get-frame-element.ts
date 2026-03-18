export function getFrameElement(win: Window): Element | null {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
