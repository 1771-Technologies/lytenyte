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
};
