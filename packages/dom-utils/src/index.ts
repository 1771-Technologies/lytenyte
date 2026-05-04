/*
Copyright 2026 1771 Technologies

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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
  getClientX,
  getClientY,
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
