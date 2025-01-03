import type { Alignment, Axis, Placement, Side } from "./types.js";

/**
 * Extracts the side component from a placement string.
 *
 * @param placement - The placement value (e.g., "top", "bottom-start")
 * @returns The side portion of the placement ("top", "right", "bottom", or "left")
 *
 * @example
 * getSide("top-start") // Returns "top"
 * getSide("right") // Returns "right"
 */
export const getSide = (placement: Placement): Side => placement.split("-")[0] as Side;

/**
 * Extracts the alignment component from a placement string, if present.
 *
 * @param placement - The placement value (e.g., "top", "bottom-start")
 * @returns The alignment ("start" or "end") if present, undefined otherwise
 *
 * @example
 * getAlignment("top-start") // Returns "start"
 * getAlignment("right") // Returns undefined
 */
export const getAlignment = (placement: Placement): Alignment | undefined =>
  placement.split("-")[1] as Alignment | undefined;

/**
 * Determines the primary axis for a given side.
 *
 * @param s - The side to get the axis for
 * @returns "x" for left/right sides, "y" for top/bottom sides
 *
 * @example
 * getAxis("left") // Returns "x"
 * getAxis("top") // Returns "y"
 */
export const getAxis = (s: Side) => (["right", "left"].includes(s) ? "x" : "y");

/**
 * Gets the alignment axis for a given side, which is the opposite of its primary axis.
 *
 * @param s - The side to get the alignment axis for
 * @returns The opposite of the side's primary axis
 *
 * @example
 * getAlignmentAxis("left") // Returns "y"
 * getAlignmentAxis("top") // Returns "x"
 */
export const getAlignmentAxis = (s: Side) => getOppositeAxis(getAxis(s));

/**
 * Returns the opposite axis.
 *
 * @param s - The axis to get the opposite for
 * @returns "y" if input is "x", "x" if input is "y"
 *
 * @example
 * getOppositeAxis("x") // Returns "y"
 * getOppositeAxis("y") // Returns "x"
 */
export const getOppositeAxis = (s: Axis) => (s === "x" ? "y" : "x");

/**
 * Gets the dimensional property (width/height) corresponding to an axis.
 *
 * @param s - The axis to get the dimension for
 * @returns "width" for x-axis, "height" for y-axis
 *
 * @example
 * getAxisLength("x") // Returns "width"
 * getAxisLength("y") // Returns "height"
 */
export const getAxisLength = (s: Axis) => (s === "y" ? "height" : "width");

/**
 * Returns the opposite side for a given side.
 *
 * @param side - The side to get the opposite for
 * @returns The opposite side (top↔bottom, left↔right)
 *
 * @example
 * getOppositePlacement("top") // Returns "bottom"
 * getOppositePlacement("left") // Returns "right"
 */
export function getOppositePlacement(side: Side): Side {
  return {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  }[side] as Side;
}
