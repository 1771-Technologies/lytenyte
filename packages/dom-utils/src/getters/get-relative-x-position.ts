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

export function getRelativeXPosition(element: HTMLElement, mouseX: number): { left: number; right: number } {
  const rect = element.getBoundingClientRect();
  const computedStyled = getComputedStyle(element);

  const isRtl = computedStyled.direction === "rtl";

  const fromRightScrollbar = isRtl ? 0 : element.offsetWidth - element.clientWidth;
  const fromRightAdjusted = rect.right - fromRightScrollbar;
  const right = fromRightAdjusted - mouseX;

  const fromLeftScrollbar = isRtl ? element.offsetWidth - element.clientWidth : 0;
  const fromLeftAdjusted = rect.left + fromLeftScrollbar;
  const left = mouseX - fromLeftAdjusted;

  return { left, right };
}
