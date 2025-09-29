export { getMaxHeaderDepth } from "./header-view/get-max-header-depth.js";
export { getVisibleColumns } from "./header-view/get-visible-columns.js";
export { getVisibleColumnsWithGroups } from "./header-view/get-visible-columns-with-groups.js";
export { isColumnGroupCollapsed } from "./header-view/is-column-group-collapsed.js";
export { makeColumnGroupMetadata } from "./header-view/make-column-group-metadata.js";
export { partitionColumnsByPinState } from "./header-view/partition-columns-by-pin-state.js";

export { computeColumnPositions } from "./coordinates/compute-column-positions.js";
export { computeRowPositions } from "./coordinates/compute-row-positions.js";

export type { SpanFn, RowPredicate, SpanLayout } from "./+types.non-gen.js";

export type { LayoutState } from "./layout/make-layout-state.js";
export { makeLayoutState } from "./layout/make-layout-state.js";
export { updateFull } from "./layout/update-full.js";
export type {
  Computed,
  DeadCells,
  LayoutDiffers,
  RootCellLookup as RootCellSpanLookup,
  UpdateLayoutArgs,
} from "./layout/update-layout.js";
export { updateLayout, FULL_WIDTH, CONTAINS_DEAD_CELLS } from "./layout/update-layout.js";

export { makeRowStore } from "./row-store/make-row-store.js";
export {
  useSignalState,
  computed,
  computedKeyedMap,
  computedMap,
  effect,
  makeAtom,
  peek,
  readonly,
  root,
  signal,
  tick,
  useSignalValue,
} from "@1771technologies/lytenyte-signal";
export type { WriteSignal, ReadSignal } from "@1771technologies/lytenyte-signal";

export { computeBounds } from "./virtual-bounds/compute-bounds.js";
export {
  DEFAULT_PREVIOUS_LAYOUT,
  GROUP_COLUMN_MULTI_PREFIX,
  GROUP_COLUMN_PREFIX,
  GROUP_COLUMN_SINGLE_ID,
  GROUP_COLUMN_TREE_DATA,
  COLUMN_MARKER_ID,
  //
  COL_OVERSCAN,
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_COLUMN_WIDTH_MAX,
  DEFAULT_COLUMN_WIDTH_MIN,
  FULL_WIDTH_MAP,
  NORMAL_CELL,
  ROW_OVERSCAN_END,
  ROW_OVERSCAN_START,
  // CSS variables
  VIEWPORT_HEIGHT_VARIABLE,
  VIEWPORT_HEIGHT_VARIABLE_USE,
  VIEWPORT_WIDTH_VARIABLE,
  VIEWPORT_WIDTH_VARIABLE_USE,
  SCROLL_WIDTH_VARIABLE,
  SCROLL_WIDTH_VARIABLE_USE,
} from "./+constants.js";

export { getTranslate } from "./utils/get-translate.js";
export { sizeFromCoord } from "./utils/size-from-coord.js";
export { getHoveredColumnIndex } from "./utils/get-hovered-column-index.js";
export { measureText } from "./utils/measure-text.js";

export { stringComparator } from "./sorting/string-comparator.js";
export { dateComparator } from "./sorting/date-comparator.js";
export { numberComparator } from "./sorting/number-comparator.js";

export { computePathTree } from "./path/compute-path-tree.js";
export { computePathTable } from "./path/compute-path-table.js";
export { computePathMatrix } from "./path/compute-path-matrix.js";
export { transposePathMatrix } from "./path/transpose-path-table.js";
export type {
  PathRoot,
  PathBranch,
  PathLeaf,
  PathMatrix,
  PathMatrixItem,
  PathProvidedItem,
  PathProvidedItemObject,
  PathTable,
  PathTableGroup,
  PathTableItem,
  PathTableLeaf,
} from "./path/+types.path-table.js";

export { evaluateDateFilter } from "./filters/evaluate-date-filter.js";
export { evaluateNumberFilter } from "./filters/evaluate-number-filter.js";
export { evaluateStringFilter } from "./filters/evaluate-string-filter.js";
export type { FilterDateSetting } from "./filters/get-date-filter-settings.js";
export { getDateFilterSettings } from "./filters/get-date-filter-settings.js";
export type { FilterNumberSettings } from "./filters/get-number-filter-settings.js";
export { getNumberFilterSettings } from "./filters/get-number-filter-settings.js";
export type { FilterStringSettings } from "./filters/get-string-filter-settings.js";
export { getStringFilterSettings } from "./filters/get-string-filter-settings.js";

export { columnScrollIntoViewValue } from "./scroll/scroll-column-into-view.js";
export { rowScrollIntoViewValue } from "./scroll/scroll-row-into-view.js";

export { getPositionFromFocusable } from "./navigation/getters/get-position-from-focusable.js";
export { getCellQuery } from "./navigation/getters/get-cell-query.js";
export { getRowIndexFromEl } from "./navigation/getters/get-row-index-from-el.js";
export { isColumnFloatingHeader } from "./navigation/predicates/is-column-floating-header.js";
export { focusCell } from "./navigation/position-movers/focus-cell.js";
export { getNearestFocusable } from "./navigation/getters/get-nearest-focusable.js";
export { getHeaderRows } from "./navigation/getters/get-header-rows.js";
export { handleNavigation } from "./navigation/handle-navigation.js";
export { useFocusTracking } from "./navigation/use-focus-tracking.js";
export { getNearestRow } from "./navigation/getters/get-nearest-row.js";

export { rowIndexForSection } from "./row/row-index-for-section.js";

// Drag support
export type {
  DragData,
  DragItems,
  DragMoveState,
  DragPosition,
  DragProps,
  DropWrapProps,
  DropWrapState,
  OnDragEvent,
  SiteLocalDragData,
  UseDraggableProps,
} from "@1771technologies/lytenyte-dragon";
export { DropWrap, dragState, useDraggable } from "@1771technologies/lytenyte-dragon";
