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

export const applyPositionSetting = () => {
  if (bslGlobals.bodyStyle !== undefined) {
    // Convert the position from "px" to Int
    const y = -parseInt(document.body.style.top, 10);
    const x = -parseInt(document.body.style.left, 10);

    // Restore styles
    const $html = document.documentElement;
    const $body = document.body;

    $html.style.height = bslGlobals.htmlStyle?.height || "";
    $html.style.overflow = bslGlobals.htmlStyle?.overflow || "";

    $body.style.position = bslGlobals.bodyStyle.position || "";
    $body.style.top = bslGlobals.bodyStyle.top || "";
    $body.style.left = bslGlobals.bodyStyle.left || "";
    $body.style.width = bslGlobals.bodyStyle.width || "";
    $body.style.height = bslGlobals.bodyStyle.height || "";
    $body.style.overflow = bslGlobals.bodyStyle.overflow || "";

    // Restore scroll
    window.scrollTo(x, y);

    bslGlobals.bodyStyle = undefined;
  }
};
