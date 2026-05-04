export type { OnAnimationFinishedParams } from "./animation-finished/index.js";
export { onAnimationFinished } from "./animation-finished/index.js";

export { isChrome, isFirefox, isIOS, isIPad, isIPhone, isMac, isWebKit } from "./detection/index.js";

export type { Autoscroller } from "./dom-autoscroller/index.js";
export { computeScrollDirection, createAutoscroller } from "./dom-autoscroller/index.js";

export type { FocusTrapOptions } from "./dom-focus/index.js";
export { getTabbables, getFocusables, isTabbable, FocusTrap } from "./dom-focus/index.js";

export { frame } from "./dom-frame/frame.js";

export { SCROLL_LOCKER } from "./dom-scroll-lock/scroll-locker.js";

export {
  getActiveElement,
  getComputedStyle,
  getDocument,
  getDocumentElement,
  getEventTarget,
  getFrameElement,
  getNearestMatching,
  getNodeName,
  getParentNode,
  getRelativeXPosition,
  getRelativeYPosition,
  getScrollStatus,
  getWindow,
} from "./getters/index.js";

export {
  contains,
  isDocument,
  isEditableElement,
  isFrame,
  isHTMLElement,
  isInputElement,
  isNode,
  isRootElement,
  isShadowRoot,
  isTextInputFocused,
  isVisualViewport,
  isWindow,
  supportsScrollEnd,
} from "./predicates/index.js";
