// Columns
export { makeColumnView } from "./columns/index.js";
export type { ColumnView } from "./columns/index.js";

export { rowPositions, columnPositions } from "./coordinates/index.js";

export { rowSelectLinkWithParents } from "./row-selection/row-select-link-with-parents.js";
export { rowSelectLinkWithoutParents } from "./row-selection/row-select-link-without-parent.js";
export type {
  VirtualTarget,
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
  GridSections,
  PartialMandatory,
} from "./types.js";

export type {
  RowLayout,
  LayoutCell,
  LayoutFullWidthRow,
  LayoutRow,
  LayoutRowWithCells,
  LayoutHeader,
  LayoutHeaderCell,
  LayoutHeaderFloating,
  LayoutHeaderGroup,
  RowView,
} from "./layout/index.js";
export { createColumnLayout, createRowLayout } from "./layout/index.js";

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

export { rowIsExpanded, rowIsExpandable, rowIsAggregated, rowIsBranch, rowIsLeaf } from "./row/index.js";

export { columnScrollIntoViewValue } from "./scroll/scroll-column-into-view.js";
export { rowScrollIntoViewValue } from "./scroll/scroll-row-into-view.js";

// Rectangle
export type { DataRect, Section, SectionedRect, HandleRangeSelectionArgs } from "./rect/index.js";
export {
  splitRect,
  rectFromGridCellPosition,
  startSection,
  endSection,
  topSection,
  centerSection,
  bottomSection,
  expandRectsInDirection,
  expandDirectionFromKey,
  handleRangeSelect,
} from "./rect/index.js";

// Navigation
export { focusCell } from "./navigation-x/focus-cell.js";
export { trackFocus } from "./navigation-x/track-focus.js";
export { navigator } from "./navigation-x/navigator.js";
export { queryCell } from "./navigation-x/query.js";
export { nearestFocusable as getNearestFocusable } from "./navigation-x/nearest-focusable.js";
export { positionFromElement as getPositionFromFocusable } from "./navigation-x/position-from-element.js";
export { getRowIndexFromEl } from "./navigation-x/get-row-index-from-el.js";
export { getNearestRow } from "./navigation-x/get-nearest-row.js";

// DOM Utils
export type { Autoscroller } from "./dom-autoscroller/index.js";
export { computeScrollDirection, createAutoscroller } from "./dom-autoscroller/index.js";
export type { FocusTrapOptions } from "./dom-focus/index.js";
export { FocusTrap, getTabbables, getFocusables } from "./dom-focus/index.js";
export {
  getActiveElement,
  getComputedStyle,
  getDocument,
  getDocumentElement,
  getEventTarget,
  getFrameElement,
  getNearestMatching,
  getNodeName,
  getParentNode,
  getWindow,
  getScrollStatus,
  getRelativeXPosition,
  getRelativeYPosition,
} from "./dom-utils/getters/index.js";
export {
  contains,
  isDocument,
  isEditableElement,
  isFrame,
  isHTMLElement,
  isInputElement,
  isNode,
  isRootElement,
  isShadowRoot,
  isTextInputFocused,
  isVisualViewport,
  isWindow,
  supportsScrollEnd,
} from "./dom-utils/predicates/index.js";
export {
  isChrome,
  isFirefox,
  isIOS,
  isIPad,
  isIPhone,
  isMac,
  isWebKit,
} from "./dom-utils/detection/index.js";
export type { OnAnimationFinishedParams } from "./dom-utils/animation-finished/animation-finished.js";
export { onAnimationFinished } from "./dom-utils/animation-finished/animation-finished.js";
export { SCROLL_LOCKER } from "./dom-scroll-lock/scroll-locker.js";
