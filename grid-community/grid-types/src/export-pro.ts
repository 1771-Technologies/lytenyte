import type { ApiProRaw } from "./api/api-pro.js";
import type { Column, ColumnBase, ColumnRowGroup } from "./column/column-pro.js";
import type { PropsProRaw } from "./props/props-pro.js";
import type { StatePro } from "./state/state-pro.js";

export type ApiPro<D, E> = ApiProRaw<D, ColumnPro<D, E>, E>;
export type ColumnPro<D, E> = Column<ApiPro<D, E>, D, E>;
export type ColumnBasePro<D, E> = ColumnBase<ApiPro<D, E>, D, E>;
export type ColumnRowGroupPro<D, E> = ColumnRowGroup<ApiPro<D, E>, D, E>;

export type GridPro<D, E> = {
  readonly state: StatePro<D, E>;
  readonly api: ApiPro<D, E>;
};

export type StateInitPro<D, E> = PropsProRaw<
  ApiPro<D, E>,
  D,
  ColumnPro<D, E>,
  E,
  ColumnBasePro<D, E>,
  ColumnRowGroupPro<D, E>
>;

// Aditional Types

export type { AggBuiltInsPro, AggFnPro, AggFnsPro, AggModelPro } from "./types/aggregations.js";
export type { FieldPro, FieldTypePathPro } from "./types/field.js";
export type {
  AutosizeResultPro,
  AutosizeOptionsPro,
  AutosizeCellParametersPro,
  AutosizeHeaderParametersPro,
} from "./types/autosize.js";

export type { RowPinPro, RowSectionsPro } from "./types/row.js";

export type {
  RowNodePro,
  RowLeafKindPro,
  RowNodeBasePro,
  RowNodeLeafPro,
  RowGroupKindPro,
  RowNodeGroupPro,
  RowNodeTotalPro,
  RowTotalKindPro,
  RowLeafOrRowTotalPro,
} from "./types/row-nodes.js";

export type {
  CellEditDateFormatPro,
  CellEditParamsPro,
  CellEditLocationPro,
  CellEditBuiltInProvidersPro,
  CellEditPointerActivatorPro,
  CellEditPredicateParamsPro,
  CellEditParserParamsPro,
  CellEditParserPro,
  CellEditUnparserPro,
  CellEditRowUpdaterParamsPro,
  CellEditRowUpdaterPro,
  CellEditProviderParamsPro,
  CellEditProviderPro,
  CellEditProvidersPro,
  CellEditPredicatePro,
  CellEditEventParamsPro,
  CellEditBeginEventParamsPro,
  CellEditEndEventParamsPro,
  CellEditBeginEventPro,
  CellEditEndEventPro,
  CellEditEventPro,
} from "./types/cell-edit.js";

export type {
  CellRendererPro,
  CellRenderersPro,
  CellRendererParamsPro,
} from "./types/cell-renderer.js";

export type {
  ColumnHeaderRendererPro,
  ColumnHeaderRendererParamsPro,
  ColumnHeaderRenderersPro,
  ColumnHeaderHeightPropertyPro,
} from "./types/column-header.js";

export type { ColumnSpanParamsPro, ColumnSpanCallbackPro } from "./types/column-span.js";

export type { ColumnMoveDragEventPro } from "./types/column-move.js";

export type { ColumnResizeDragEventPro } from "./types/column-resize.js";

export type {
  ColumnGroupRowItemPro,
  ColumnGroupRowPro,
  ColumnGroupRowsPro,
  ColumnGroupVisibilityPro,
} from "./types/column-group.js";

export type {
  FilterTextOperatorPro,
  FilterTextPro,
  FilterNumberOperatorPro,
  FilterNumberPro,
  FilterDateOperatorPro,
  FilterDatePeriodPro,
  FilterDatePro,
  FilterCombinedPro,
  FilterFunctionPro,
  FilterSimpleColumnPro,
  FilterNonCombinedPro,
} from "./types/filters.js";

export type { ColumnPinPro } from "./types/column-pin.js";

export type {
  PositionGridCellKindPro,
  PositionFullWidthKindPro,
  PositionHeaderCellKindPro,
  PositionHeaderGroupCellKindPro,
  PositionFloatingCellKindPro,
  PositionGridCellPro,
  PositionFullWidthRowPro,
  PositionHeaderCellPro,
  PositionHeaderGroupCellPro,
  PositionFloatingCellPro,
  PositionPro,
  PositionFocusPro,
} from "./types/position.js";

export type {
  SortOptionsPro,
  SortModelItemPro,
  SortComparatorFnPro,
  SortComparatorsPro,
  SortTypesPro,
  SortAccentModifierPro,
  SortAbsoluteModifierPro,
  SortNullModifierPro,
  SortCycleOptionPro,
} from "./types/sort.js";

export type {
  DataRectPro,
  DataRectResultPro,
  ExportCsvOptionsPro,
  ExportDataRectOptionsPro,
  ExportTransformDataRowPro,
  ExportTransformDataRowParamsPro,
} from "./types/export.js";

export type {
  RowDetailHeightPro,
  RowDetailParamsPro,
  RowDetailEnabledPro,
  RowDetailRendererPro,
} from "./types/row-detail.js";

export type {
  RowSelectionPointerActivatorPro,
  RowSelectionModePro,
  RowSelectionCheckboxPro,
  RowSelectionPredicateParamsPro,
  RowSelectionPredicatePro,
  RowSelectionEventPro,
  RowSelectionEventParamsPro,
} from "./types/row-selection.js";

export type {
  RowFullWdithPredicatePro,
  RowFullWidthPredicateParamsPro,
  RowFullWidthRendererPro,
  RowFullWidthRendererParamsPro,
} from "./types/row-full-width.js";

export type {
  RowDragEventPro,
  RowDragEventParamsPro,
  RowDragPredicatePro,
} from "./types/row-drag.js";

export type { RowGroupDisplayModePro, RowGroupExpansionsPro } from "./types/row-group.js";

export type {
  FloatingCellRendererPro,
  FloatingCellRenderersPro,
  FloatingCellRendererParamsPro,
} from "./types/floating-cell.js";

export type { RowHeightPro } from "./types/row-height.js";

export type { RowSpanParamsPro, RowSpanCallbackPro } from "./types/row-span.js";

export type { ScrollBoundsPro } from "./types/virtualization.js";

// Only Pro Features

export type { CellSelectionModePro, CellSelectionRectPro } from "./types/cell-selection-pro.js";

export type {
  ColumnFilterPro,
  FilterInPro,
  ColumnFilterModelPro,
  ColumnInFilterItemPro,
  ColumnInFilterItemLeafPro,
  ColumnInFilterItemParentPro,
} from "./types/filter-pro.js";

export type {
  ClipboardCopyOptionsPro,
  ClipboardTransformCopyPro,
  ClipboardTransformPastePro,
  ClipboardTransformHeaderPro,
  ClipboardTransformCellValuePro,
  ClipboardTransformCopyParamsPro,
  ClipboardTransformPasteParamsPro,
  ClipboardTransformHeaderGroupPro,
  ClipboardTransformHeaderParamsPro,
  ClipboardTransformCellValueParamsPro,
  ClipboardTransformHeaderGroupParamsPro,
} from "./types/clipboard-pro.js";

export type {
  OverlayIdPro,
  OverlayPro,
  OverlaysPro,
  OverlayRendererParamsPro,
} from "./types/overlay-pro.js";

export type {
  ContextMenuGridTargetsPro,
  ContextMenuRendererPro,
  ContextMenuRendererParamsPro,
} from "./types/context-menu-pro.js";

export type {
  ColumnMenuRendererParamsPro,
  ColumnMenuRendererPro,
} from "./types/column-menu-pro.js";

export type { ColumnPivotEventParamsPro, ColumnPivotEventPro } from "./types/column-pivot-pro.js";

export type {
  DialogFramePro,
  PanelFramePro,
  PopoverFramePro,
} from "./types/component-frames-pro.js";
