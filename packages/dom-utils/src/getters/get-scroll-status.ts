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

type ScrollStatus = "none" | "partial" | "full";
type ScrollTuple = [x: ScrollStatus, y: ScrollStatus];

function getAxisStatus(
  scrollPos: number,
  clientSize: number,
  scrollSize: number,
  epsilon = 1, // helps with sub-pixel / rounding differences
): ScrollStatus {
  const maxScroll = Math.max(0, scrollSize - clientSize);

  if (scrollPos <= epsilon) return "none";
  if (scrollPos >= maxScroll - epsilon) return "full";
  return "partial";
}

/**
 * Returns scroll status tuple for [x, y]
 * - "no-scroll": content fits (no overflow)
 * - "partial": overflow exists and not fully scrolled to the end (includes top/left)
 * - "full-scrolled": overflow exists and scrolled to the end (right/bottom)
 */
export function getScrollStatus(el: HTMLElement, epsilon = 1): ScrollTuple {
  const x = getAxisStatus(el.scrollLeft, el.clientWidth, el.scrollWidth, epsilon);
  const y = getAxisStatus(el.scrollTop, el.clientHeight, el.scrollHeight, epsilon);
  return [x, y];
}
