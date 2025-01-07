import type { FrameAxeProps } from "./frame.js";

/**
 * Default accessibility props for the Frame component providing standard screen reader
 * announcements for resize and move operations. All measurements are rounded to
 * whole pixels for clearer audio feedback.
 *
 * @constant
 * @type {FrameAxeProps}
 *
 * @property {string} axeResizeLabel - Label identifying the resize handle ("Resize panel")
 * @property {string} axeResizeDescription - Comprehensive instructions for resizing using
 *    keyboard or mouse, detailing available arrow key controls
 * @property {function} axeResizeStartText - Announces initial dimensions when resize begins
 * @property {function} axeResizeEndText - Announces final dimensions when resize completes
 * @property {string} axeMoveLabel - Label identifying the draggable area ("Draggable Area")
 * @property {string} axeMoveDescription - Instructions for moving the panel using keyboard or mouse
 * @property {function} axeMoveStartText - Announces starting position when movement begins
 * @property {function} axeMoveEndText - Announces final position when movement completes
 *
 * @example
 * ```tsx
 * // Using default props
 * <Frame axe={defaultAxeProps} />
 *
 * // Extending default props
 * <Frame axe={{
 *   ...defaultAxeProps,
 *   axeResizeLabel: "Custom resize label"
 * }} />
 * ```
 *
 * @remarks
 * These defaults provide a complete set of accessibility messages that:
 * - Give clear instructions for both keyboard and mouse interactions
 * - Announce positions and dimensions in whole pixels
 * - Use consistent language patterns for start/end announcements
 * - Cover both resize and move operations comprehensively
 */
export const frameDefaultAxe: FrameAxeProps = {
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
    return `Move ended at position ${Math.round(x)} pixels from the left and ${Math.round(y)} pixels from the top`;
  },
};
