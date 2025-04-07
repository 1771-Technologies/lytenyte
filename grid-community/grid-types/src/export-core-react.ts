import type * as C from "./export-core.js";
import type { ReactNode } from "react";

export type ApiCoreReact<D = any> = C.ApiCore<D, ReactNode>;
export type ColumnCoreReact<D = any> = C.ColumnCore<D, ReactNode>;
export type ColumnBaseCoreReact<D = any> = C.ColumnBaseCore<D, ReactNode>;
export type ColumnRowGroupCoreReact<D = any> = C.ColumnRowGroupCore<D, ReactNode>;

export type GridCoreReact<D = any> = C.GridCore<D, ReactNode>;

export type StateInitCoreReact<D = any> = C.StateInitCore<D, ReactNode>;

// Additional types

export type AggBuiltInsCoreReact = C.AggBuiltInsCore;
export type AggFnCoreReact<D = any> = C.AggFnCore<D, ReactNode>;
export type AggFnsCoreReact<D = any> = C.AggFnsCore<D, ReactNode>;
export type AggModelCoreReact<D = any> = C.AggModelCore<D, ReactNode>;

export type FieldCoreReact<D = any> = C.FieldCore<D, ReactNode>;
export type FieldTypePathCoreReact = C.FieldTypePathCore;

export type AutosizeResultCoreReact = C.AutosizeResultCore;
export type AutosizeOptionsCoreReact = C.AutosizeOptionsCore;
export type AutosizeCellParametersCoreReact<D = any> = C.AutosizeCellParametersCore<D, ReactNode>;
export type AutosizeHeaderParametersCoreReact<D = any> = C.AutosizeHeaderParametersCore<
  D,
  ReactNode
>;

export type RowPinCoreReact = C.RowPinCore;
export type RowSectionsCoreReact = C.RowSectionsCore;

export type RowNodeCoreReact<D = any> = C.RowNodeCore<D>;
export type RowLeafKindCoreReact = C.RowLeafKindCore;
export type RowNodeBaseCoreReact = C.RowNodeBaseCore;
export type RowNodeLeafCoreReact<D> = C.RowNodeLeafCore<D>;
export type RowGroupKindCoreReact = C.RowGroupKindCore;
export type RowNodeGroupCoreReact = C.RowNodeGroupCore;
export type RowNodeTotalCoreReact = C.RowNodeTotalCore;
export type RowTotalKindCoreReact = C.RowTotalKindCore;
export type RowLeafOrRowTotalCoreReact<D = any> = C.RowLeafOrRowTotalCore<D>;

export type CellEditDateFormatCoreReact = C.CellEditDateFormatCore;
export type CellEditParamsCoreReact = C.CellEditParamsCore;
export type CellEditLocationCoreReact = C.CellEditLocationCore;
export type CellEditBuiltInProvidersCoreReact = C.CellEditBuiltInProvidersCore;
export type CellEditPointerActivatorCoreReact = C.CellEditPointerActivatorCore;
export type CellEditPredicateParamsCoreReact<D = any> = C.CellEditPredicateParamsCore<D, ReactNode>;
export type CellEditParserParamsCoreReact<D = any> = C.CellEditParserParamsCore<D, ReactNode>;
export type CellEditParserCoreReact<D = any> = C.CellEditParserCore<D, ReactNode>;
export type CellEditUnparserCoreReact<D = any> = C.CellEditUnparserCore<D, ReactNode>;
export type CellEditRowUpdaterParamsCoreReact<D = any> = C.CellEditRowUpdaterParamsCore<
  D,
  ReactNode
>;
export type CellEditRowUpdaterCoreReact<D = any> = C.CellEditRowUpdaterCore<D, ReactNode>;
export type CellEditProviderParamsCoreReact<D = any> = C.CellEditProviderParamsCore<D, ReactNode>;
export type CellEditProviderCoreReact<D = any> = C.CellEditProviderCore<D, ReactNode>;
export type CellEditProvidersCoreReact<D = any> = C.CellEditProvidersCore<D, ReactNode>;
export type CellEditPredicateCoreReact<D = any> = C.CellEditPredicateCore<D, ReactNode>;
export type CellEditEventParamsCoreReact<D = any> = C.CellEditEventParamsCore<D, ReactNode>;
export type CellEditBeginEventParamsCoreReact<D = any> = C.CellEditBeginEventParamsCore<
  D,
  ReactNode
>;
export type CellEditEndEventParamsCoreReact<D = any> = C.CellEditEndEventParamsCore<D, ReactNode>;
export type CellEditBeginEventCoreReact<D = any> = C.CellEditBeginEventCore<D, ReactNode>;
export type CellEditEndEventCoreReact<D = any> = C.CellEditEndEventCore<D, ReactNode>;
export type CellEditEventCoreReact<D = any> = C.CellEditEventCore<D, ReactNode>;

export type CellRendererCoreReact<D = any> = C.CellRendererCore<D, ReactNode>;
export type CellRenderersCoreReact<D = any> = C.CellRenderersCore<D, ReactNode>;
export type CellRendererParamsCoreReact<D = any> = C.CellRendererParamsCore<D, ReactNode>;

export type ColumnHeaderRendererCoreReact<D = any> = C.ColumnHeaderRendererCore<D, ReactNode>;
export type ColumnHeaderRendererParamsCoreReact<D = any> = C.ColumnHeaderRendererParamsCore<
  D,
  ReactNode
>;
export type ColumnHeaderRenderersCoreReact<D = any> = C.ColumnHeaderRenderersCore<D, ReactNode>;
export type ColumnHeaderHeightPropertyCoreReact = C.ColumnHeaderHeightPropertyCore;

export type ColumnSpanParamsCoreReact<D = any> = C.ColumnSpanParamsCore<D, ReactNode>;
export type ColumnSpanCallbackCoreReact<D = any> = C.ColumnSpanCallbackCore<D, ReactNode>;
export type ColumnMoveDragEventCoreReact<D = any> = C.ColumnMoveDragEventCore<D, ReactNode>;
export type ColumnResizeDragEventCoreReact<D = any> = C.ColumnResizeDragEventCore<D, ReactNode>;

export type ColumnGroupRowItemCoreReact = C.ColumnGroupRowItemCore;
export type ColumnGroupRowCoreReact = C.ColumnGroupRowCore;
export type ColumnGroupRowsCoreReact = C.ColumnGroupRowsCore;
export type ColumnGroupVisibilityCoreReact = C.ColumnGroupVisibilityCore;

export type FilterTextOperatorCoreReact = C.FilterTextOperatorCore;
export type FilterTextCoreReact = C.FilterTextCore;
export type FilterNumberOperatorCoreReact = C.FilterNumberOperatorCore;
export type FilterNumberCoreReact = C.FilterNumberCore;
export type FilterDateOperatorCoreReact = C.FilterDateOperatorCore;
export type FilterDatePeriodCoreReact = C.FilterDatePeriodCore;
export type FilterDateCoreReact = C.FilterDateCore;
export type FilterCombinedCoreReact<D = any> = C.FilterCombinedCore<D, ReactNode>;
export type FilterFunctionCoreReact<D = any> = C.FilterFunctionCore<D, ReactNode>;
export type FilterSimpleColumnCoreReact = C.FilterSimpleColumnCore;
export type FilterNonCombinedCoreReact<D = any> = C.FilterNonCombinedCore<D, ReactNode>;
export type ColumnFilterCoreReact<D = any> = C.ColumnFilterCore<D, ReactNode>;
export type ColumnFilterModelCoreReact<D = any> = C.ColumnFilterModelCore<D, ReactNode>;

export type ColumnPinCoreReact = C.ColumnPinCore;

export type PositionGridCellKindCoreReact = C.PositionGridCellKindCore;
export type PositionFullWidthKindCoreReact = C.PositionFullWidthKindCore;
export type PositionHeaderCellKindCoreReact = C.PositionHeaderCellKindCore;
export type PositionHeaderGroupCellKindCoreReact = C.PositionHeaderGroupCellKindCore;
export type PositionFloatingCellKindCoreReact = C.PositionFloatingCellKindCore;
export type PositionGridCellCoreReact = C.PositionGridCellCore;
export type PositionFullWidthRowCoreReact = C.PositionFullWidthRowCore;
export type PositionHeaderCellCoreReact = C.PositionHeaderCellCore;
export type PositionHeaderGroupCellCoreReact = C.PositionHeaderGroupCellCore;
export type PositionFloatingCellCoreReact = C.PositionFloatingCellCore;
export type PositionCoreReact = C.PositionCore;
export type PositionFocusCoreReact = C.PositionFocusCore;

export type SortOptionsCoreReact = C.SortOptionsCore;
export type SortModelItemCoreReact = C.SortModelItemCore;
export type SortComparatorFnCoreReact<D = any> = C.SortComparatorFnCore<D, ReactNode>;
export type SortComparatorsCoreReact = C.SortComparatorsCore;
export type SortTypesCoreReact = C.SortTypesCore;
export type SortAccentModifierCoreReact = C.SortAccentModifierCore;
export type SortAbsoluteModifierCoreReact = C.SortAbsoluteModifierCore;
export type SortNullModifierCoreReact = C.SortNullModifierCore;
export type SortCycleOptionCoreReact = C.SortCycleOptionCore;

export type DataRectCoreReact = C.DataRectCore;
export type DataRectResultCoreReact<D = any> = C.DataRectResultCore<D, ReactNode>;
export type ExportCsvOptionsCoreReact<D = any> = C.ExportCsvOptionsCore<D, ReactNode>;
export type ExportDataRectOptionsCoreReact<D = any> = C.ExportDataRectOptionsCore<D, ReactNode>;
export type ExportTransformDataRowCoreReact<D = any> = C.ExportTransformDataRowCore<D, ReactNode>;
export type ExportTransformDataRowParamsCoreReact<D = any> = C.ExportTransformDataRowParamsCore<
  D,
  ReactNode
>;

export type RowDetailHeightCoreReact<D = any> = C.RowDetailHeightCore<D, ReactNode>;
export type RowDetailParamsCoreReact<D = any> = C.RowDetailParamsCore<D, ReactNode>;
export type RowDetailEnabledCoreReact<D = any> = C.RowDetailEnabledCore<D, ReactNode>;
export type RowDetailRendererCoreReact<D = any> = C.RowDetailRendererCore<D, ReactNode>;

export type RowSelectionPointerActivatorCoreReact = C.RowSelectionPointerActivatorCore;
export type RowSelectionModeCoreReact = C.RowSelectionModeCore;
export type RowSelectionCheckboxCoreReact = C.RowSelectionCheckboxCore;
export type RowSelectionPredicateParamsCoreReact<D = any> = C.RowSelectionPredicateParamsCore<
  D,
  ReactNode
>;
export type RowSelectionPredicateCoreReact<D = any> = C.RowSelectionPredicateCore<D, ReactNode>;
export type RowSelectionEventCoreReact<D = any> = C.RowSelectionEventCore<D, ReactNode>;
export type RowSelectionEventParamsCoreReact<D = any> = C.RowSelectionEventParamsCore<D, ReactNode>;

export type RowFullWdithPredicateCoreReact<D = any> = C.RowFullWdithPredicateCore<D, ReactNode>;
export type RowFullWidthPredicateParamsCoreReact<D = any> = C.RowFullWidthPredicateParamsCore<
  D,
  ReactNode
>;
export type RowFullWidthRendererCoreReact<D = any> = C.RowFullWidthRendererCore<D, ReactNode>;
export type RowFullWidthRendererParamsCoreReact<D = any> = C.RowFullWidthRendererParamsCore<
  D,
  ReactNode
>;

export type RowDragEventCoreReact<D = any> = C.RowDragEventCore<D, ReactNode>;
export type RowDragEventParamsCoreReact<D = any> = C.RowDragEventParamsCore<D, ReactNode>;
export type RowDragPredicateCoreReact<D = any> = C.RowDragPredicateCore<D, ReactNode>;

export type RowGroupDisplayModeCoreReact = C.RowGroupDisplayModeCore;
export type RowGroupExpansionsCoreReact = C.RowGroupExpansionsCore;

export type FloatingCellRendererCoreReact<D = any> = C.FloatingCellRendererCore<D, ReactNode>;
export type FloatingCellRenderersCoreReact<D = any> = C.FloatingCellRenderersCore<D, ReactNode>;
export type FloatingCellRendererParamsCoreReact<D = any> = C.FloatingCellRendererParamsCore<
  D,
  ReactNode
>;

export type RowHeightCoreReact = C.RowHeightCore;

export type RowSpanParamsCoreReact<D = any> = C.RowSpanParamsCore<D, ReactNode>;
export type RowSpanCallbackCoreReact<D = any> = C.RowSpanCallbackCore<D, ReactNode>;

export type ScrollBoundsCoreReact = C.ScrollBoundsCore;
