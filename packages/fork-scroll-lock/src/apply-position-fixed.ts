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

export const applyPositionFixed = () =>
  window.requestAnimationFrame(() => {
    const $html = document.documentElement;
    const $body = document.body;
    // If bodyStyle is already set, don't set it again.
    if (bslGlobals.bodyStyle === undefined) {
      bslGlobals.htmlStyle = { ...$html.style };
      bslGlobals.bodyStyle = { ...$body.style };

      // Update the dom inside an animation frame
      const { scrollY, scrollX, innerHeight } = window;

      $html.style.height = "100%";
      $html.style.overflow = "hidden";

      $body.style.position = "fixed";
      $body.style.top = `${-scrollY}px`;
      $body.style.left = `${-scrollX}px`;
      $body.style.width = "100%";
      $body.style.height = "auto";
      $body.style.overflow = "hidden";

      setTimeout(
        () =>
          window.requestAnimationFrame(() => {
            // Attempt to check if the bottom bar appeared due to the position change
            const bottomBarHeight = innerHeight - window.innerHeight;
            if (bottomBarHeight && scrollY >= innerHeight) {
              // Move the content further up so that the bottom bar doesn't hide it
              $body.style.top = -(scrollY + bottomBarHeight) + "px";
            }
          }),
        300,
      );
    }
  });
