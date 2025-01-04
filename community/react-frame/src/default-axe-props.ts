import type { FrameAxeProps } from "./frame";

export const defaultAxeProps: FrameAxeProps = {
  axeResizeLabel: "Resize panel",
  axeResizeDescription:
    "Use arrow keys to resize the panel: " +
    "Up and Down arrows adjust height, " +
    "Left and Right arrows adjust width. " +
    "Or click and drag to adjust both dimensions.",
  axeResizeStartText: (w, h) => {
    return `Started resizing panel, initial size of ${Math.round(w)} pixels wide by ${Math.round(h)} pixels tall`;
  },
  axeResizeEndText: (w, h) => {
    return `Panel resized to ${Math.round(w)} pixels wide by ${Math.round(h)} pixels tall`;
  },

  axeMoveLabel: "Draggable Area",
  axeMoveDescription: "Use the arrow keys to move this component, or click and drag with the mouse",
  axeMoveStartText: (x, y) => {
    return `Started moving from position ${Math.round(x)} pixels from the left and ${Math.round(y)} pixels from the top`;
  },
  axeMoveEndText: (x, y) => {
    return `Move ended at position ${Math.round(x)} pixels from the left and ${Math.round(y)} pixels from the right`;
  },
};
