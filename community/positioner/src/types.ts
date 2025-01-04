/**
 * Utility type that flattens an intersection type into a single object type.
 * Helps TypeScript provide better type hints and autocompletion.
 *
 * @template T - The type to be flattened
 */
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Represents the dimensions of an element in pixels.
 */
export type Dimensions = {
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
};

/**
 * Represents 2D coordinates in pixels.
 */
export type Coords = {
  /** X-coordinate in pixels */
  x: number;
  /** Y-coordinate in pixels */
  y: number;
};

/**
 * Represents a rectangle with both position and dimensions.
 * Combines coordinates (x, y) and dimensions (width, height).
 */
export type Rect = Prettify<Coords & Dimensions>;

/**
 * Valid sides for positioning a floating element relative to a reference element.
 */
export type Side = "top" | "right" | "bottom" | "left";

/**
 * Alignment options for positioning along the cross axis.
 * - "start": Aligns to the start of the cross axis
 * - "end": Aligns to the end of the cross axis
 */
export type Alignment = "start" | "end";

/**
 * Combined type representing a side with an alignment.
 * Creates strings like "top-start", "bottom-end", etc.
 *
 * @example
 * "top-start" - Positions above, aligned to start
 * "right-end" - Positions to the right, aligned to end
 */
export type AlignedPlacement = `${Side}-${Alignment}`;

/**
 * Full placement type that can be either a simple side or an aligned placement.
 * Flattened using Prettify for better type hints.
 *
 * @example
 * "top" - Simple top placement
 * "bottom-start" - Bottom placement with start alignment
 */
export type Placement = Prettify<Side | AlignedPlacement>;

/**
 * Primary axes used in positioning calculations.
 * - "x": Horizontal axis
 * - "y": Vertical axis
 */
export type Axis = "x" | "y";
