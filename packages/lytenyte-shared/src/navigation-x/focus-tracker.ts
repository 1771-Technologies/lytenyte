import type { PositionUnion } from "../+types";

export class FocusTracker {
  viewport: HTMLElement;

  constructor(
    vp: HTMLElement,
    onPositionChange: (p: PositionUnion | null) => void,
    onFocusChange: (b: boolean) => void,
  ) {
    this.viewport = vp;

    const controller = new AbortController();
    this.viewport.addEventListener("focusin", (ev) => {
      onFocusChange(true);
    });
  }
}
