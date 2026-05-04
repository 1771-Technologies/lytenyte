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

import { frame } from "../dom-frame/frame.js";

export interface OnAnimationFinishedParams {
  readonly element: HTMLElement;
  readonly fn: () => void;

  readonly signal?: AbortSignal | null;
}
/**
 * Runs a callback after all current animations on the element have finished. If the element has
 * no getAnimations method, the callback is invoked immediately. The callback is skipped if the
 * provided signal is aborted.
 */
export function onAnimationFinished({ element, signal, fn }: OnAnimationFinishedParams): void {
  if (typeof element.getAnimations !== "function") {
    fn();
    return;
  }

  const execute = () => {
    Promise.allSettled(element.getAnimations().map((anim) => anim.finished)).then(() => {
      if (signal?.aborted) return;
      fn();
    });
  };

  frame(execute);
}
