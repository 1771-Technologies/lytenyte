import type { ApiCommunity } from "./api/api-core.js";
import type { Column, ColumnBase, ColumnRowGroup } from "./column/column-core.js";

export type ApiCore<D, E> = ApiCommunity<D, ColumnCore<D, E>, E>;
export type ColumnCore<D, E> = Column<ApiCore<D, E>, D, E>;
export type ColumnBaseCore<D, E> = ColumnBase<ApiCore<D, E>, D, E>;
export type ColumnRowGroupCore<D, E> = ColumnRowGroup<ApiCore<D, E>, D, E>;

// Additional types

export type { AggBuiltInsCore, AggFnCore, AggFnsCore, AggModelCore } from "./types/aggregations.js";
export type { FieldCore, FieldTypePathCore } from "./types/field.js";
export type {
  AutosizeResultCore,
  AutosizeOptionsCore,
  AutosizeCellParametersCore,
  AutosizeHeaderParametersCore,
} from "./types/autosize.js";

export type { RowPinCore, RowSectionsCore } from "./types/row.js";

export type {
  RowNodeCore,
  RowLeafKindCore,
  RowNodeBaseCore,
  RowNodeLeafCore,
  RowGroupKindCore,
  RowNodeGroupCore,
  RowNodeTotalCore,
  RowTotalKindCore,
  RowLeafOrRowTotalCore,
} from "./types/row-nodes.js";

export type {
  CellEditDateFormatCore,
  CellEditParamsCore,
  CellEditLocationCore,
  CellEditBuiltInProvidersCore,
  CellEditPointerActivatorCore,
  CellEditPredicateParamsCore,
  CellEditParserParamsCore,
  CellEditParserCore,
  CellEditUnparserCore,
  CellEditRowUpdaterParamsCore,
  CellEditRowUpdaterCore,
  CellEditProviderParamsCore,
  CellEditProviderCore,
  CellEditProvidersCore,
  CellEditPredicateCore,
  CellEditEventParamsCore,
  CellEditBeginEventParamsCore,
  CellEditEndEventParamsCore,
  CellEditBeginEventCore,
  CellEditEndEventCore,
  CellEditEventCore,
} from "./types/cell-edit.js";

export type {
  CellRendererCore,
  CellRenderersCore,
  CellRendererParamsCore,
} from "./types/cell-renderer.js";

export type {
  ColumnHeaderRendererCore,
  ColumnHeaderRendererParamsCore,
  ColumnHeaderRenderersCore,
  ColumnHeaderHeightPropertyCore,
} from "./types/column-header.js";

export type { ColumnSpanParamsCore, ColumnSpanCallbackCore } from "./types/column-span.js";
export type { ColumnMoveDragEventCore } from "./types/column-move.js";
export type { ColumnResizeDragEventCore } from "./types/column-resize.js";

export type {
  ColumnGroupRowItemCore,
  ColumnGroupRowCore,
  ColumnGroupRowsCore,
  ColumnGroupVisibilityCore,
} from "./types/column-group.js";

export type {
  FilterTextOperatorCore,
  FilterTextCore,
  FilterNumberOperatorCore,
  FilterNumberCore,
  FilterDateOperatorCore,
  FilterDatePeriodCore,
  FilterDateCore,
  FilterCombinedCore,
  FilterFunctionCore,
  FilterSimpleColumnCore,
  FilterNonCombinedCore,
  ColumnFilterCore,
  ColumnFilterModelCore,
} from "./types/filters.js";

export type { ColumnPinCore } from "./types/column-pin.js";

export type {
  PositionGridCellKindCore,
  PositionFullWidthKindCore,
  PositionHeaderCellKindCore,
  PositionHeaderGroupCellKindCore,
  PositionFloatingCellKindCore,
  PositionGridCellCore,
  PositionFullWidthRowCore,
  PositionHeaderCellCore,
  PositionHeaderGroupCellCore,
  PositionFloatingCellCore,
  PositionCore,
  PositionFocusCore,
} from "./types/position.js";

export type {
  SortOptionsCore,
  SortModelItemCore,
  SortComparatorFnCore,
  SortComparatorsCore,
  SortTypesCore,
  SortAccentModifierCore,
  SortAbsoluteModifierCore,
  SortNullModifierCore,
  SortCycleOptionCore,
} from "./types/sort.js";

export type {
  DataRectCore,
  DataRectResultCore,
  ExportCsvOptionsCore,
  ExportDataRectOptionsCore,
  ExportTransformDataRowCore,
  ExportTransformDataRowParamsCore,
} from "./types/export.js";

export type {
  RowDetailHeightCore,
  RowDetailParamsCore,
  RowDetailEnabledCore,
  RowDetailRendererCore,
} from "./types/row-detail.js";

export type {
  RowSelectionPointerActivatorCore,
  RowSelectionModeCore,
  RowSelectionCheckboxCore,
  RowSelectionPredicateParamsCore,
  RowSelectionPredicateCore,
  RowSelectionEventCore,
  RowSelectionEventParamsCore,
} from "./types/row-selection.js";

export type {
  RowFullWdithPredicateCore,
  RowFullWidthPredicateParamsCore,
  RowFullWidthRendererCore,
  RowFullWidthRendererParamsCore,
} from "./types/row-full-width.js";

export type {
  RowDragEventCore,
  RowDragEventParamsCore,
  RowDragPredicateCore,
} from "./types/row-drag.js";

export type { RowGroupDisplayModeCore, RowGroupExpansionsCore } from "./types/row-group.js";

export type {
  FloatingCellRendererCore,
  FloatingCellRenderersCore,
  FloatingCellRendererParamsCore,
} from "./types/floating-cell.js";

export type { RowHeightCore } from "./types/row-height.js";

export type { RowSpanParamsCore, RowSpanCallbackCore } from "./types/row-span.js";

export type { ScrollBoundsCore } from "./types/virtualization.js";
