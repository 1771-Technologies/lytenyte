/** Returns the frame element for the given window, or null if not running inside a frame. */
export function getFrameElement(win: Window): Element | null {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
