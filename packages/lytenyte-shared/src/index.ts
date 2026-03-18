// Columns
export { makeColumnView } from "./columns/index.js";
export type { ColumnView } from "./columns/index.js";

export { rowPositions, columnPositions } from "./coordinates/index.js";

export { rowSelectLinkWithParents } from "./row-selection/row-select-link-with-parents.js";
export { rowSelectLinkWithoutParents } from "./row-selection/row-select-link-without-parent.js";
export type {
  Writable,
  PathField,
  Field,
  Dimension,
  DimensionSort,
  DimensionAgg,
  RowSelectionIsolated,
  RowSelectionLinked,
  RowSelectionState,
  RowSelectNode,
  RowSelectNodeWithParent,
  RowSelectionLinkedWithParent,
  RowSelectionStateWithParent,
  Aggregator,
  SpanFn,
  RowPredicate,
  SpanLayout,
  ColumnAbstract,
  ColumnGroupVisibility,
  ColumnPin,
  RowHeight,
  RowPin,
  RowSource,
  SortFn,
  GroupIdFn,
  LeafIdFn,
  FilterFn,
  GroupFn,
  AggregationFn,
  RowNode,
  RowAtom,
  RowLeaf,
  RowGroup,
  RowAggregated,
  PositionDetailCell,
  PositionFloatingCell,
  PositionFullWidthRow,
  PositionGridCell,
  PositionGridCellRoot,
  PositionHeaderCell,
  PositionHeaderGroupCell,
  PositionUnion,
} from "./types.js";

export type {
  LayoutHeader,
  LayoutHeaderCell,
  LayoutHeaderFloating,
  LayoutHeaderGroup,
  LayoutState,
  UpdateLayoutArgs,
  Computed,
  DeadCells,
  LayoutDiffers,
  RootCellSpanLookup,
  LayoutCell,
  LayoutFullWidthRow,
  LayoutRow,
  LayoutRowWithCells,
  RowView,
} from "./layout/index.js";
export {
  makeColumnLayout,
  makeLayoutState,
  makeRowLayout,
  updateFull,
  updateLayout,
  FULL_WIDTH,
  CONTAINS_DEAD_CELLS,
} from "./layout/index.js";

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

export { rowIndexForSection } from "./row/row-index-for-section.js";
export { columnScrollIntoViewValue } from "./scroll/scroll-column-into-view.js";
export { rowScrollIntoViewValue } from "./scroll/scroll-row-into-view.js";

// Navigation
export { focusCell } from "./navigation-x/focus-cell.js";
export { trackFocus } from "./navigation-x/track-focus.js";
export { navigator } from "./navigation-x/navigator.js";
export { queryCell } from "./navigation-x/query.js";
export { nearestFocusable as getNearestFocusable } from "./navigation-x/nearest-focusable.js";
export { positionFromElement as getPositionFromFocusable } from "./navigation-x/position-from-element.js";
export { getRowIndexFromEl } from "./navigation-x/get-row-index-from-el.js";
export { getNearestRow } from "./navigation-x/get-nearest-row.js";

// JS UTILS
export {
  arrayShallow,
  clamp,
  distance,
  equal,
  fastShallowCompare,
  get,
  getClientX,
  getClientY,
  getRelativeXPosition,
  getRelativeYPosition,
  isFunction,
  itemsWithIdToMap,
  rangedBinarySearch,
  rangesOverlap,
  runWithBackoff,
  sleep,
  wait,
  moveRelative,
} from "./js-utils/index.js";

// DOM Utils
export type { FocusTrapOptions } from "./dom-focus/index.js";
export { FocusTrap, getTabbables, getFocusables } from "./dom-focus/index.js";

export {
  supportsScrollEnd,
  getActiveElement,
  getComputedStyle,
  getFrameElement,
  getNearestMatching,
  isAppleDevice,
  isChrome,
  isFirefox,
  isHTMLElement,
  isIOS,
  isIPad,
  isIPhone,
  isInView,
  isLastTraversableNode,
  isMac,
  isWebKit,
  isTextInputFocused,
  testPlatform,
  testUserAgent,
  getScrollStatus,
} from "./dom-utils/index.js";
export type { OnAnimationFinishedParams } from "./dom-utils/animation-finished.js";
export { onAnimationFinished } from "./dom-utils/animation-finished.js";

export { SCROLL_LOCKER } from "./dom-scroll-lock/scroll-locker.js";
