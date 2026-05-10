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

// Inspired by https://github.com/theKashey/aria-hidden/blob/master/src/index.ts
// Licensed under MIT
// Adapted from https://github.com/chakra-ui/zag/blob/main/packages/utilities/aria-hidden/src/aria-hidden.ts
// Licensed under MIT

import { walkTreeOutside } from "./walk-tree.js";

const getParentNode = (originalTarget: Element | Element[]): HTMLElement | null => {
  const target = Array.isArray(originalTarget) ? originalTarget[0] : originalTarget;
  return target.ownerDocument.body;
};

export const hideOthers = (
  originalTarget: Element | Element[],
  parentNode = getParentNode(originalTarget),
  markerName = "data-aria-hidden",
  followControlledElements = true,
) => {
  if (!parentNode) return;
  return walkTreeOutside(originalTarget, {
    parentNode,
    markerName,
    controlAttribute: "aria-hidden",
    explicitBooleanValue: true,
    followControlledElements,
  });
};

export const inertOthers = (
  originalTarget: Element | Element[],
  parentNode = getParentNode(originalTarget),
  markerName = "data-inerted",
  followControlledElements = true,
) => {
  if (!parentNode) return;
  return walkTreeOutside(originalTarget, {
    parentNode,
    markerName,
    controlAttribute: "inert",
    explicitBooleanValue: false,
    followControlledElements,
  });
};

const supportsInert = () =>
  // eslint-disable-next-line no-prototype-builtins
  typeof HTMLElement !== "undefined" && HTMLElement.prototype.hasOwnProperty("inert");

export const suppressOthers = (
  originalTarget: Element | Element[],
  parentNode?: HTMLElement,
  markerName: string = "data-suppressed",
  followControlledElements: boolean = true,
) => {
  const fn = supportsInert() ? inertOthers : hideOthers;
  return fn(originalTarget, parentNode, markerName, followControlledElements);
};
