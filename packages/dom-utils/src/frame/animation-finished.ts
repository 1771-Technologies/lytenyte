import { frame } from "./frame.js";

export interface OnAnimationFinishedParams {
  readonly element: HTMLElement;
  readonly fn: () => void;

  readonly signal?: AbortSignal | null;
}
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
