export { computePosition } from "./computePosition.js";
export type { DetectOverflowOptions } from "./detectOverflow.js";
export { detectOverflow } from "./detectOverflow.js";
export type { ArrowOptions } from "./middleware/arrow.js";
export { arrow } from "./middleware/arrow.js";
export type { AutoPlacementOptions } from "./middleware/autoPlacement.js";
export { autoPlacement } from "./middleware/autoPlacement.js";
export type { FlipOptions } from "./middleware/flip.js";
export { flip } from "./middleware/flip.js";
export type { HideOptions } from "./middleware/hide.js";
export { hide } from "./middleware/hide.js";
export type { InlineOptions } from "./middleware/inline.js";
export { inline } from "./middleware/inline.js";
export type { OffsetOptions } from "./middleware/offset.js";
export { offset } from "./middleware/offset.js";
export type { LimitShiftOptions, ShiftOptions } from "./middleware/shift.js";
export { limitShift, shift } from "./middleware/shift.js";
export type { SizeOptions } from "./middleware/size.js";
export { size } from "./middleware/size.js";
export type {
  Boundary,
  ComputePosition,
  ComputePositionConfig,
  ComputePositionReturn,
  Derivable,
  ElementContext,
  Elements,
  FloatingElement,
  Middleware,
  MiddlewareArguments,
  MiddlewareData,
  MiddlewareReturn,
  MiddlewareState,
  Platform,
  ReferenceElement,
  RootBoundary,
} from "./types.js";
export type {
  AlignedPlacement,
  Alignment,
  Axis,
  ClientRectObject,
  Coords,
  Dimensions,
  ElementRects,
  Length,
  Padding,
  Placement,
  Rect,
  Side,
  SideObject,
  Strategy,
  VirtualElement,
} from "../utils/index.js";
// This export exists only for backwards compatibility. It will be removed in
// the next major version.
export { rectToClientRect } from "../utils/index.js";
