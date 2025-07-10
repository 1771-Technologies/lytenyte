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
import { bslGlobals } from "./+globals.bsl.js";
import type { BodyScrollOptions } from "./+types.bsl.js";

export const applyOverflowHidden = (options?: BodyScrollOptions) => {
  // If  previousBodyPaddingRight is already set, don't set it again.
  if (bslGlobals.previousMarginRight === undefined) {
    const reserveScrollBarGap = options?.reserveScrollBarGap ?? true;
    const scrollBarGap = window.innerWidth - document.documentElement.getBoundingClientRect().width;

    if (reserveScrollBarGap && scrollBarGap > 0) {
      const computedBodyMarginRight = parseInt(
        window.getComputedStyle(document.body).getPropertyValue("margin-right"),
        10,
      );
      bslGlobals.previousMarginRight = document.body.style.marginRight;
      document.body.style.marginRight = `${computedBodyMarginRight + scrollBarGap}px`;
      document.body.style.setProperty(
        "--body-scroll-margin",
        `${computedBodyMarginRight + scrollBarGap}px`,
      );
    }
  }

  // If previousBodyOverflowSetting is already set, don't set it again.
  if (bslGlobals.previousBodyOverflowSetting === undefined) {
    bslGlobals.previousBodyOverflowSetting = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
};
