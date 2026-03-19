import { frame } from "../../dom-frame/frame.js";

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
