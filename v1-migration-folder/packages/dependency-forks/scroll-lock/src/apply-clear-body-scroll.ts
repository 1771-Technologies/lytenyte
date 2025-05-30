/*
Copyright 2025 1771 Technologies

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
import { isIOS } from "@1771technologies/lytenyte-dom-utils";
import { bslGlobals } from "./+globals.bsl.js";
import { applyPositionSetting } from "./apply-position-setting.js";
import { applyRestoreOverflow } from "./apply-restore-overflow.js";
import { handlePreventDefault } from "./handle-prevent-default.js";

export const applyClearBodyScroll = (): void => {
  if (isIOS()) {
    // Clear all locks ontouchstart/ontouchmove handlers, and the references.
    bslGlobals.locks.forEach((lock) => {
      lock.targetElement.ontouchstart = null;
      lock.targetElement.ontouchmove = null;
    });

    if (bslGlobals.documentListenerAdded) {
      (document as any).removeEventListener("touchmove", handlePreventDefault, { passive: false });
      bslGlobals.documentListenerAdded = false;
    }

    // Reset initial clientY.
    bslGlobals.initialClientY = -1;

    applyPositionSetting();
  } else {
    applyRestoreOverflow();
  }

  bslGlobals.locks = [];
  bslGlobals.locksIndex.clear();
};
