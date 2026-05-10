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

import { unwrapHost } from "./unwrap-host.js";

/**
 * Validates and corrects a list of target elements relative to a parent element.
 *
 * For each target: if it is directly contained by the parent it is kept as-is;
 * if it lives inside a shadow tree, `unwrapHost` walks up to find the shadow host
 * and substitutes that if the host is contained by the parent. Targets that cannot
 * be resolved to any element inside the parent are dropped and a console error is
 * emitted.
 */
export const correctTargets = (parent: HTMLElement, targets: Element[]): Element[] =>
  targets
    .map((target) => {
      if (parent.contains(target)) return target;
      const correctedTarget = unwrapHost(target);
      if (correctedTarget && parent.contains(correctedTarget)) {
        return correctedTarget;
      }
      console.error("[ariaHidden] target", target, "in not contained inside", parent, ". Doing nothing");
      return null;
    })
    .filter((x): x is Element => Boolean(x));
