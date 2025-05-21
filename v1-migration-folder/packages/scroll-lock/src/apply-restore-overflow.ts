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

export const applyRestoreOverflow = () => {
  if (bslGlobals.previousMarginRight !== undefined) {
    document.body.style.marginRight = bslGlobals.previousMarginRight;

    document.body.style.removeProperty("--body-scroll-margin");

    // Restore previousBodyPaddingRight to undefined so setOverflowHidden knows it can be set again.
    bslGlobals.previousMarginRight = undefined;
  }

  if (bslGlobals.previousBodyOverflowSetting !== undefined) {
    document.body.style.overflow = bslGlobals.previousBodyOverflowSetting;

    // Restore previousBodyOverflowSetting to undefined
    // so setOverflowHidden knows it can be set again.
    bslGlobals.previousBodyOverflowSetting = undefined;
  }
};
