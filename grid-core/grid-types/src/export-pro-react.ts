import type * as P from "./export-pro.js";
import type { ReactNode } from "react";

export type ApiProReact<D = any> = P.ApiPro<D, ReactNode>;
export type ColumnProReact<D = any> = P.ColumnPro<D, ReactNode>;
export type ColumnBaseProReact<D = any> = P.ColumnBasePro<D, ReactNode>;
export type ColumnRowGroupProReact<D = any> = P.ColumnRowGroupPro<D, ReactNode>;
export type RowDataSourceProReact<D = any> = P.RowDataSourcePro<D, ReactNode>;

export type GridProReact<D = any> = P.GridPro<D, ReactNode>;

export type StateInitProReact<D = any> = P.StateInitPro<D, ReactNode>;

// Additional Types

export type AggBuiltInsProReact = P.AggBuiltInsPro;
export type AggFnProReact<D = any> = P.AggFnPro<D, ReactNode>;
export type AggFnsProReact<D = any> = P.AggFnsPro<D, ReactNode>;
export type AggModelProReact<D = any> = P.AggModelPro<D, ReactNode>;

export type FieldProReact<D = any> = P.FieldPro<D, ReactNode>;
export type FieldTypePathProReact = P.FieldTypePathPro;

export type AutosizeResultProReact = P.AutosizeResultPro;
export type AutosizeOptionsProReact = P.AutosizeOptionsPro;
export type AutosizeCellParametersProReact<D = any> = P.AutosizeCellParametersPro<D, ReactNode>;
export type AutosizeHeaderParametersProReact<D = any> = P.AutosizeHeaderParametersPro<D, ReactNode>;

export type RowPinProReact = P.RowPinPro;
export type RowSectionsProReact = P.RowSectionsPro;

export type RowNodeProReact<D = any> = P.RowNodePro<D>;
export type RowLeafKindProReact = P.RowLeafKindPro;
export type RowNodeBaseProReact = P.RowNodeBasePro;
export type RowNodeLeafProReact<D = any> = P.RowNodeLeafPro<D>;
export type RowGroupKindProReact = P.RowGroupKindPro;
export type RowNodeGroupProReact = P.RowNodeGroupPro;

export type CellEditDateFormatProReact = P.CellEditDateFormatPro;
export type CellEditParamsProReact = P.CellEditParamsPro;
export type CellEditLocationProReact = P.CellEditLocationPro;
export type CellEditBuiltInProvidersProReact = P.CellEditBuiltInProvidersPro;
export type CellEditPointerActivatorProReact = P.CellEditPointerActivatorPro;
export type CellEditPredicateParamsProReact<D = any> = P.CellEditPredicateParamsPro<D, ReactNode>;
export type CellEditParserParamsProReact<D = any> = P.CellEditParserParamsPro<D, ReactNode>;
export type CellEditParserProReact<D = any> = P.CellEditParserPro<D, ReactNode>;
export type CellEditUnparserProReact<D = any> = P.CellEditUnparserPro<D, ReactNode>;
export type CellEditRowUpdaterParamsProReact<D = any> = P.CellEditRowUpdaterParamsPro<D, ReactNode>;
export type CellEditRowUpdaterProReact<D = any> = P.CellEditRowUpdaterPro<D, ReactNode>;
export type CellEditProviderParamsProReact<D = any> = P.CellEditProviderParamsPro<D, ReactNode>;
export type CellEditProviderProReact<D = any> = P.CellEditProviderPro<D, ReactNode>;
export type CellEditProvidersProReact<D = any> = P.CellEditProvidersPro<D, ReactNode>;
export type CellEditPredicateProReact<D = any> = P.CellEditPredicatePro<D, ReactNode>;
export type CellEditEventParamsProReact<D = any> = P.CellEditEventParamsPro<D, ReactNode>;
export type CellEditBeginEventParamsProReact<D = any> = P.CellEditBeginEventParamsPro<D, ReactNode>;
export type CellEditEndEventParamsProReact<D = any> = P.CellEditEndEventParamsPro<D, ReactNode>;
export type CellEditBeginEventProReact<D = any> = P.CellEditBeginEventPro<D, ReactNode>;
export type CellEditEndEventProReact<D = any> = P.CellEditEndEventPro<D, ReactNode>;
export type CellEditEventProReact<D = any> = P.CellEditEventPro<D, ReactNode>;

export type CellRendererProReact<D = any> = P.CellRendererPro<D, ReactNode>;
export type CellRenderersProReact<D = any> = P.CellRenderersPro<D, ReactNode>;
export type CellRendererParamsProReact<D = any> = P.CellRendererParamsPro<D, ReactNode>;

export type ColumnHeaderRendererProReact<D = any> = P.ColumnHeaderRendererPro<D, ReactNode>;
export type ColumnHeaderRendererParamsProReact<D = any> = P.ColumnHeaderRendererParamsPro<
  D,
  ReactNode
>;
export type ColumnHeaderRenderersProReact<D = any> = P.ColumnHeaderRenderersPro<D, ReactNode>;
export type ColumnHeaderHeightPropertyProReact = P.ColumnHeaderHeightPropertyPro;
export type ColumnGroupHeaderRendererProReact<D = any> = P.ColumnGroupHeaderRendererPro<
  D,
  ReactNode
>;
export type ColumnGroupHeaderRendererParamsProReact<D = any> = P.ColumnGroupHeaderRendererParamsPro<
  D,
  ReactNode
>;

export type ColumnSpanParamsProReact<D = any> = P.ColumnSpanParamsPro<D, ReactNode>;
export type ColumnSpanCallbackProReact<D = any> = P.ColumnSpanCallbackPro<D, ReactNode>;

export type ColumnMoveDragEventProReact<D = any> = P.ColumnMoveDragEventPro<D, ReactNode>;

export type ColumnResizeDragEventProReact<D = any> = P.ColumnResizeDragEventPro<D, ReactNode>;

export type ColumnGroupRowItemProReact = P.ColumnGroupRowItemPro;
export type ColumnGroupRowProReact = P.ColumnGroupRowPro;
export type ColumnGroupRowsProReact = P.ColumnGroupRowsPro;
export type ColumnGroupVisibilityProReact = P.ColumnGroupVisibilityPro;

export type FilterTextOperatorProReact = P.FilterTextOperatorPro;
export type FilterTextProReact = P.FilterTextPro;
export type FilterNumberOperatorProReact = P.FilterNumberOperatorPro;
export type FilterNumberProReact = P.FilterNumberPro;
export type FilterDateOperatorProReact = P.FilterDateOperatorPro;
export type FilterDatePeriodProReact = P.FilterDatePeriodPro;
export type FilterDateProReact = P.FilterDatePro;
export type FilterCombinedProReact<D = any> = P.FilterCombinedPro<D, ReactNode>;
export type FilterFunctionProReact<D = any> = P.FilterFunctionPro<D, ReactNode>;
export type FilterSimpleColumnProReact = P.FilterSimpleColumnPro;
export type FilterNonCombinedProReact<D = any> = P.FilterNonCombinedPro<D, ReactNode>;

export type ColumnPinProReact = P.ColumnPinPro;

export type PositionGridCellKindProReact = P.PositionGridCellKindPro;
export type PositionFullWidthKindProReact = P.PositionFullWidthKindPro;
export type PositionHeaderCellKindProReact = P.PositionHeaderCellKindPro;
export type PositionHeaderGroupCellKindProReact = P.PositionHeaderGroupCellKindPro;
export type PositionFloatingCellKindProReact = P.PositionFloatingCellKindPro;
export type PositionGridCellProReact = P.PositionGridCellPro;
export type PositionFullWidthRowProReact = P.PositionFullWidthRowPro;
export type PositionHeaderCellProReact = P.PositionHeaderCellPro;
export type PositionHeaderGroupCellProReact = P.PositionHeaderGroupCellPro;
export type PositionFloatingCellProReact = P.PositionFloatingCellPro;
export type PositionProReact = P.PositionPro;
export type PositionFocusProReact = P.PositionFocusPro;

export type SortOptionsProReact = P.SortOptionsPro;
export type SortModelItemProReact = P.SortModelItemPro;
export type SortComparatorFnProReact<D = any> = P.SortComparatorFnPro<D, ReactNode>;
export type SortComparatorsProReact = P.SortComparatorsPro;
export type SortTypesProReact = P.SortTypesPro;
export type SortAccentModifierProReact = P.SortAccentModifierPro;
export type SortAbsoluteModifierProReact = P.SortAbsoluteModifierPro;
export type SortNullModifierProReact = P.SortNullModifierPro;
export type SortCycleOptionProReact = P.SortCycleOptionPro;

export type DataRectProReact = P.DataRectPro;
export type DataRectResultProReact<D = any> = P.DataRectResultPro<D, ReactNode>;
export type ExportCsvOptionsProReact<D = any> = P.ExportCsvOptionsPro<D, ReactNode>;
export type ExportDataRectOptionsProReact<D = any> = P.ExportDataRectOptionsPro<D, ReactNode>;
export type ExportTransformDataRowProReact<D = any> = P.ExportTransformDataRowPro<D, ReactNode>;
export type ExportTransformDataRowParamsProReact<D = any> = P.ExportTransformDataRowParamsPro<
  D,
  ReactNode
>;

export type RowDetailHeightProReact<D = any> = P.RowDetailHeightPro<D, ReactNode>;
export type RowDetailParamsProReact<D = any> = P.RowDetailParamsPro<D, ReactNode>;
export type RowDetailEnabledProReact<D = any> = P.RowDetailEnabledPro<D, ReactNode>;
export type RowDetailRendererProReact<D = any> = P.RowDetailRendererPro<D, ReactNode>;

export type RowSelectionPointerActivatorProReact = P.RowSelectionPointerActivatorPro;
export type RowSelectionModeProReact = P.RowSelectionModePro;
export type RowSelectionCheckboxProReact = P.RowSelectionCheckboxPro;
export type RowSelectionPredicateParamsProReact<D = any> = P.RowSelectionPredicateParamsPro<
  D,
  ReactNode
>;
export type RowSelectionPredicateProReact<D = any> = P.RowSelectionPredicatePro<D, ReactNode>;
export type RowSelectionEventProReact<D = any> = P.RowSelectionEventPro<D, ReactNode>;
export type RowSelectionEventParamsProReact<D = any> = P.RowSelectionEventParamsPro<D, ReactNode>;

export type RowFullWdithPredicateProReact<D = any> = P.RowFullWdithPredicatePro<D, ReactNode>;
export type RowFullWidthPredicateParamsProReact<D = any> = P.RowFullWidthPredicateParamsPro<
  D,
  ReactNode
>;
export type RowFullWidthRendererProReact<D = any> = P.RowFullWidthRendererPro<D, ReactNode>;
export type RowFullWidthRendererParamsProReact<D = any> = P.RowFullWidthRendererParamsPro<
  D,
  ReactNode
>;

export type RowDragEventProReact<D = any> = P.RowDragEventPro<D, ReactNode>;
export type RowDragEventParamsProReact<D = any> = P.RowDragEventParamsPro<D, ReactNode>;
export type RowDragPredicateProReact<D = any> = P.RowDragPredicatePro<D, ReactNode>;

export type RowGroupDisplayModeProReact = P.RowGroupDisplayModePro;
export type RowGroupExpansionsProReact = P.RowGroupExpansionsPro;

export type FloatingCellRendererProReact<D = any> = P.FloatingCellRendererPro<D, ReactNode>;
export type FloatingCellRenderersProReact<D = any> = P.FloatingCellRenderersPro<D, ReactNode>;
export type FloatingCellRendererParamsProReact<D = any> = P.FloatingCellRendererParamsPro<
  D,
  ReactNode
>;

export type RowHeightProReact = P.RowHeightPro;

export type RowSpanParamsProReact<D = any> = P.RowSpanParamsPro<D, ReactNode>;
export type RowSpanCallbackProReact<D = any> = P.RowSpanCallbackPro<D, ReactNode>;

export type ScrollBoundsProReact = P.ScrollBoundsPro;

// Only Pro Features

export type CellSelectionModeProReact = P.CellSelectionModePro;
export type CellSelectionRectProReact = P.CellSelectionRectPro;

export type UIHintsColumnHeaderProReact = P.UIHintsColumnHeaderPro;

export type ColumnFilterProReact<D = any> = P.ColumnFilterPro<D, ReactNode>;
export type FilterInProReact = P.FilterInPro;
export type ColumnFilterModelProReact<D = any> = P.ColumnFilterModelPro<D, ReactNode>;
export type ColumnInFilterItemProReact = P.ColumnInFilterItemPro;
export type ColumnInFilterItemLeafProReact = P.ColumnInFilterItemLeafPro;
export type ColumnInFilterItemParentProReact = P.ColumnInFilterItemParentPro;

export type ClipboardCopyOptionsProReact = P.ClipboardCopyOptionsPro;
export type ClipboardTransformCopyProReact<D = any> = P.ClipboardTransformCopyPro<D, ReactNode>;
export type ClipboardTransformPasteProReact<D = any> = P.ClipboardTransformPastePro<D, ReactNode>;
export type ClipboardTransformHeaderProReact<D = any> = P.ClipboardTransformHeaderPro<D, ReactNode>;
export type ClipboardTransformCellValueProReact<D = any> = P.ClipboardTransformCellValuePro<
  D,
  ReactNode
>;
export type ClipboardTransformCopyParamsProReact<D = any> = P.ClipboardTransformCopyParamsPro<
  D,
  ReactNode
>;
export type ClipboardTransformPasteParamsProReact<D = any> = P.ClipboardTransformPasteParamsPro<
  D,
  ReactNode
>;
export type ClipboardTransformHeaderGroupProReact<D = any> = P.ClipboardTransformHeaderGroupPro<
  D,
  ReactNode
>;
export type ClipboardTransformHeaderParamsProReact<D = any> = P.ClipboardTransformHeaderParamsPro<
  D,
  ReactNode
>;
export type ClipboardTransformCellValueParamsProReact<D = any> =
  P.ClipboardTransformCellValueParamsPro<D, ReactNode>;
export type ClipboardTransformHeaderGroupParamsProReact<D = any> =
  P.ClipboardTransformHeaderGroupParamsPro<D, ReactNode>;

export type OverlayIdProReact = P.OverlayIdPro;
export type OverlayProReact<D = any> = P.OverlayPro<D, ReactNode>;
export type OverlaysProReact<D = any> = P.OverlaysPro<D, ReactNode>;
export type OverlayRendererParamsProReact<D = any> = P.OverlayRendererParamsPro<D, ReactNode>;

export type ContextMenuGridTargetsProReact = P.ContextMenuGridTargetsPro;
export type ContextMenuRendererProReact<D = any> = P.ContextMenuRendererPro<D, ReactNode>;
export type ContextMenuRendererParamsProReact<D = any> = P.ContextMenuRendererParamsPro<
  D,
  ReactNode
>;
export type TargetProReact = P.TargetPro;

export type ColumnMenuRendererParamsProReact<D = any> = P.ColumnMenuRendererParamsPro<D, ReactNode>;
export type ColumnMenuRendererProReact<D = any> = P.ColumnMenuRendererPro<D, ReactNode>;

export type ColumnPivotEventParamsProReact<D = any> = P.ColumnPivotEventParamsPro<D, ReactNode>;
export type ColumnPivotEventProReact<D = any> = P.ColumnPivotEventPro<D, ReactNode>;

export type DialogFrameProReact<D = any> = P.DialogFramePro<D, ReactNode>;
export type PanelFrameProReact<D = any> = P.PanelFramePro<D, ReactNode>;
export type PopoverFrameProReact<D = any> = P.PopoverFramePro<D, ReactNode>;
export type MenuFrameProReact<D = any> = P.MenuFramePro<D, ReactNode>;
