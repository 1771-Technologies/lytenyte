import type { SplitPaneAxe } from "./split-pane";

export const splitPaneAxe: SplitPaneAxe = {
  ariaDescription: (orientation, rtl) => {
    const dragDescription =
      orientation === "horizontal"
        ? "Drag up to shrink the size of the primary panel. Drag down to increase the size of the primary panel"
        : rtl
          ? "Drag left to increase the size of the primary panel. Drag right to decrease the size of the primary panel"
          : "Drag right to increase the size of the primary panel. Drag left to decrease the size of the primary panel";

    const keyDescription =
      orientation === "horizontal"
        ? "Press the up arrow key to increase the size of the primary panel. Press the down arrow key to decrease the size of primary panel"
        : rtl
          ? "Press left arrow key to increase the size of the primary panel. Press the right arrow key to decrease the size of primary panel"
          : "Press right arrow key to increase the size of the primary panel. Press the left arrow key to decrease the size of primary panel";

    return `The panel can be resized by using the mouse and dragging. ${dragDescription}. The keyboard can also be used. ${keyDescription}`;
  },
};
