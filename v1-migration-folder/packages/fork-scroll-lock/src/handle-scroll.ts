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
import { isElementTotallyScrolled } from "@1771technologies/lytenyte-dom-utils";
import { bslGlobals } from "./+globals.bsl.js";
import { handlePreventDefault } from "./handle-prevent-default.js";
import { shouldAllowTouchMove } from "./should-allow-touch-move.js";

export const handleScroll = (event: TouchEvent, targetElement: HTMLElement): boolean => {
  const clientY = event.targetTouches[0].clientY - bslGlobals.initialClientY;

  if (shouldAllowTouchMove(event.target as EventTarget)) {
    return false;
  }

  if (targetElement && targetElement.scrollTop === 0 && clientY > 0) {
    // element is at the top of its scroll.
    return handlePreventDefault(event);
  }

  if (isElementTotallyScrolled(targetElement) && clientY < 0) {
    // element is at the bottom of its scroll.
    return handlePreventDefault(event);
  }

  event.stopPropagation();
  return true;
};
