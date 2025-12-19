export type { LayoutHeader, LayoutHeaderCell, LayoutHeaderFloating, LayoutHeaderGroup } from "./column-layout.js";
export { makeColumnLayout } from "./column-layout.js";
export type { LayoutState } from "./make-layout-state.js";
export { makeLayoutState } from "./make-layout-state.js";
export { updateFull } from "./update-full.js";
export type {
  UpdateLayoutArgs,
  Computed,
  DeadCells,
  LayoutDiffers,
  RootCellLookup as RootCellSpanLookup,
} from "./update-layout.js";
export { updateLayout, CONTAINS_DEAD_CELLS, FULL_WIDTH } from "./update-layout.js";
