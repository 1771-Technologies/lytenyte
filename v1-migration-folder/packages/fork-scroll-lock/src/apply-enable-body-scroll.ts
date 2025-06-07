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

export const applyEnableBodyScroll = (targetElement: HTMLElement): void => {
  bslGlobals.locksIndex.set(
    targetElement,
    bslGlobals.locksIndex?.get(targetElement)
      ? (bslGlobals.locksIndex?.get(targetElement) as number) - 1
      : 0,
  );
  if (bslGlobals.locksIndex?.get(targetElement) === 0) {
    bslGlobals.locks = bslGlobals.locks.filter((lock) => lock.targetElement !== targetElement);
    bslGlobals.locksIndex?.delete(targetElement);
  }

  if (isIOS()) {
    targetElement.ontouchstart = null;
    targetElement.ontouchmove = null;

    if (bslGlobals.documentListenerAdded && bslGlobals.locks.length === 0) {
      (document as any).removeEventListener("touchmove", handlePreventDefault, { passive: false });
      bslGlobals.documentListenerAdded = false;
    }
  }

  if (bslGlobals.locks.length === 0) {
    if (isIOS()) {
      applyPositionSetting();
    } else {
      applyRestoreOverflow();
    }
  }
};
