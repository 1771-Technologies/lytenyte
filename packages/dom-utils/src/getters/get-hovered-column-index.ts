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

import { rangedBinarySearch } from "@1771technologies/js-utils";
import { getRelativeXPosition } from "./get-relative-x-position.js";

interface GetHoveredColumnIndexArgs {
  readonly viewport: HTMLElement;
  readonly xPositions: Uint32Array;
  readonly startCount: number;
  readonly endCount: number;
  readonly centerCount: number;
  readonly clientX: number;
  readonly rtl: boolean;
}

export function getHoveredColumnIndex({
  viewport,
  xPositions,
  startCount,
  endCount,
  centerCount,
  clientX,
  rtl,
}: GetHoveredColumnIndexArgs) {
  const startWidth = xPositions[startCount];
  const endWidth = xPositions.at(-1)! - xPositions.at(-endCount - 1)!;

  const coords = getRelativeXPosition(viewport, clientX);
  const visualX = rtl ? coords.right : coords.left;
  const viewportWidth = viewport.clientWidth;

  let x = -1;
  if (visualX > 0 && visualX < viewportWidth) {
    if (visualX < startWidth) {
      x = visualX;
    } else if (visualX > viewportWidth - endWidth) {
      x = visualX - (viewportWidth - endWidth) + xPositions[startCount + centerCount];
    } else {
      x = visualX + Math.abs(viewport.scrollLeft);
      const maxX = xPositions.at(-endCount - 1)!;
      if (x > maxX) x = -1;
    }
  }

  return x >= 0 ? rangedBinarySearch(xPositions, x) : null;
}
