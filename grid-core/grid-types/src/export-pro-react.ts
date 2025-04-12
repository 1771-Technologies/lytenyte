import type * as P from "./export-pro.js";
import type { ReactNode as R } from "react";

export type ApiProReact<D = any> = P.ApiPro<D, R>;
export type ColumnProReact<D = any> = P.ColumnPro<D, R>;
export type ColumnBaseProReact<D = any> = P.ColumnBasePro<D, R>;
export type ColumnRowGroupProReact<D = any> = P.ColumnRowGroupPro<D, R>;
export type RowDataSourceProReact<D = any> = P.RowDataSourcePro<D, R>;

export type GridProReact<D = any> = P.GridPro<D, R>;

export type StateInitProReact<D = any> = P.StateInitPro<D, R>;

// Additional Types

export type AggBuiltInsProReact = P.AggBuiltInsPro;
export type AggFnProReact<D = any> = P.AggFnPro<D, R>;
export type AggFnsProReact<D = any> = P.AggFnsPro<D, R>;
export type AggModelProReact<D = any> = P.AggModelPro<D, R>;

export type FieldProReact<D = any> = P.FieldPro<D, R>;
export type FieldTypePathProReact = P.FieldTypePathPro;

export type AutosizeResultProReact = P.AutosizeResultPro;
export type AutosizeOptionsProReact = P.AutosizeOptionsPro;
export type AutosizeCellParametersProReact<D = any> = P.AutosizeCellParametersPro<D, R>;
export type AutosizeHeaderParametersProReact<D = any> = P.AutosizeHeaderParametersPro<D, R>;

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
export type CellEditPredicateParamsProReact<D = any> = P.CellEditPredicateParamsPro<D, R>;
export type CellEditParserParamsProReact<D = any> = P.CellEditParserParamsPro<D, R>;
export type CellEditParserProReact<D = any> = P.CellEditParserPro<D, R>;
export type CellEditUnparserProReact<D = any> = P.CellEditUnparserPro<D, R>;
export type CellEditRowUpdaterParamsProReact<D = any> = P.CellEditRowUpdaterParamsPro<D, R>;
export type CellEditRowUpdaterProReact<D = any> = P.CellEditRowUpdaterPro<D, R>;
export type CellEditProviderParamsProReact<D = any> = P.CellEditProviderParamsPro<D, R>;
export type CellEditProviderProReact<D = any> = P.CellEditProviderPro<D, R>;
export type CellEditProvidersProReact<D = any> = P.CellEditProvidersPro<D, R>;
export type CellEditPredicateProReact<D = any> = P.CellEditPredicatePro<D, R>;
export type CellEditEventParamsProReact<D = any> = P.CellEditEventParamsPro<D, R>;
export type CellEditBeginEventParamsProReact<D = any> = P.CellEditBeginEventParamsPro<D, R>;
export type CellEditEndEventParamsProReact<D = any> = P.CellEditEndEventParamsPro<D, R>;
export type CellEditBeginEventProReact<D = any> = P.CellEditBeginEventPro<D, R>;
export type CellEditEndEventProReact<D = any> = P.CellEditEndEventPro<D, R>;
export type CellEditEventProReact<D = any> = P.CellEditEventPro<D, R>;

export type CellRendererProReact<D = any> = P.CellRendererPro<D, R>;
export type CellRenderersProReact<D = any> = P.CellRenderersPro<D, R>;
export type CellRendererParamsProReact<D = any> = P.CellRendererParamsPro<D, R>;

export type ColumnHeaderRendererProReact<D = any> = P.ColumnHeaderRendererPro<D, R>;
export type ColumnHeaderRendererParamsProReact<D = any> = P.ColumnHeaderRendererParamsPro<D, R>;
export type ColumnHeaderRenderersProReact<D = any> = P.ColumnHeaderRenderersPro<D, R>;
export type ColumnHeaderHeightPropertyProReact = P.ColumnHeaderHeightPropertyPro;
export type ColumnGroupHeaderRendererProReact<D = any> = P.ColumnGroupHeaderRendererPro<D, R>;
export type ColumnGroupHeaderRendererParamsProReact<D = any> = P.ColumnGroupHeaderRendererParamsPro<
  D,
  R
>;

export type ColumnSpanParamsProReact<D = any> = P.ColumnSpanParamsPro<D, R>;
export type ColumnSpanCallbackProReact<D = any> = P.ColumnSpanCallbackPro<D, R>;

export type ColumnMoveDragEventProReact<D = any> = P.ColumnMoveDragEventPro<D, R>;

export type ColumnResizeDragEventProReact<D = any> = P.ColumnResizeDragEventPro<D, R>;

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
export type FilterCombinedProReact<D = any> = P.FilterCombinedPro<D, R>;
export type FilterFunctionProReact<D = any> = P.FilterFunctionPro<D, R>;
export type FilterSimpleColumnProReact = P.FilterSimpleColumnPro;
export type FilterNonCombinedProReact<D = any> = P.FilterNonCombinedPro<D, R>;

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
export type SortComparatorFnProReact<D = any> = P.SortComparatorFnPro<D, R>;
export type SortComparatorsProReact = P.SortComparatorsPro;
export type SortTypesProReact = P.SortTypesPro;
export type SortAccentModifierProReact = P.SortAccentModifierPro;
export type SortAbsoluteModifierProReact = P.SortAbsoluteModifierPro;
export type SortNullModifierProReact = P.SortNullModifierPro;
export type SortCycleOptionProReact = P.SortCycleOptionPro;

export type DataRectProReact = P.DataRectPro;
export type DataRectResultProReact<D = any> = P.DataRectResultPro<D, R>;
export type ExportCsvOptionsProReact<D = any> = P.ExportCsvOptionsPro<D, R>;
export type ExportDataRectOptionsProReact<D = any> = P.ExportDataRectOptionsPro<D, R>;
export type ExportTransformDataRowProReact<D = any> = P.ExportTransformDataRowPro<D, R>;
export type ExportTransformDataRowParamsProReact<D = any> = P.ExportTransformDataRowParamsPro<D, R>;

export type RowDetailHeightProReact<D = any> = P.RowDetailHeightPro<D, R>;
export type RowDetailParamsProReact<D = any> = P.RowDetailParamsPro<D, R>;
export type RowDetailEnabledProReact<D = any> = P.RowDetailEnabledPro<D, R>;
export type RowDetailRendererProReact<D = any> = P.RowDetailRendererPro<D, R>;

export type RowSelectionPointerActivatorProReact = P.RowSelectionPointerActivatorPro;
export type RowSelectionModeProReact = P.RowSelectionModePro;
export type RowSelectionCheckboxProReact = P.RowSelectionCheckboxPro;
export type RowSelectionPredicateParamsProReact<D = any> = P.RowSelectionPredicateParamsPro<D, R>;
export type RowSelectionPredicateProReact<D = any> = P.RowSelectionPredicatePro<D, R>;
export type RowSelectionEventProReact<D = any> = P.RowSelectionEventPro<D, R>;
export type RowSelectionEventParamsProReact<D = any> = P.RowSelectionEventParamsPro<D, R>;

export type RowFullWdithPredicateProReact<D = any> = P.RowFullWdithPredicatePro<D, R>;
export type RowFullWidthPredicateParamsProReact<D = any> = P.RowFullWidthPredicateParamsPro<D, R>;
export type RowFullWidthRendererProReact<D = any> = P.RowFullWidthRendererPro<D, R>;
export type RowFullWidthRendererParamsProReact<D = any> = P.RowFullWidthRendererParamsPro<D, R>;

export type RowDragEventProReact<D = any> = P.RowDragEventPro<D, R>;
export type RowDragEventParamsProReact<D = any> = P.RowDragEventParamsPro<D, R>;
export type RowDragPredicateProReact<D = any> = P.RowDragPredicatePro<D, R>;

export type RowGroupDisplayModeProReact = P.RowGroupDisplayModePro;
export type RowGroupExpansionsProReact = P.RowGroupExpansionsPro;

export type FloatingCellRendererProReact<D = any> = P.FloatingCellRendererPro<D, R>;
export type FloatingCellRenderersProReact<D = any> = P.FloatingCellRenderersPro<D, R>;
export type FloatingCellRendererParamsProReact<D = any> = P.FloatingCellRendererParamsPro<D, R>;

export type RowHeightProReact = P.RowHeightPro;

export type RowSpanParamsProReact<D = any> = P.RowSpanParamsPro<D, R>;
export type RowSpanCallbackProReact<D = any> = P.RowSpanCallbackPro<D, R>;

export type ScrollBoundsProReact = P.ScrollBoundsPro;

// Only Pro Features

export type CellSelectionModeProReact = P.CellSelectionModePro;
export type CellSelectionRectProReact = P.CellSelectionRectPro;

export type UIHintsColumnHeaderProReact = P.UIHintsColumnHeaderPro;

export type ColumnFilterProReact<D = any> = P.ColumnFilterPro<D, R>;
export type FilterInProReact = P.FilterInPro;
export type ColumnFilterModelProReact<D = any> = P.ColumnFilterModelPro<D, R>;
export type ColumnInFilterItemProReact = P.ColumnInFilterItemPro;
export type ColumnInFilterItemLeafProReact = P.ColumnInFilterItemLeafPro;
export type ColumnInFilterItemParentProReact = P.ColumnInFilterItemParentPro;

export type ClipboardCopyOptionsProReact = P.ClipboardCopyOptionsPro;
export type ClipboardTransformCopyProReact<D = any> = P.ClipboardTransformCopyPro<D, R>;
export type ClipboardTransformPasteProReact<D = any> = P.ClipboardTransformPastePro<D, R>;
export type ClipboardTransformHeaderProReact<D = any> = P.ClipboardTransformHeaderPro<D, R>;
export type ClipboardTransformCellValueProReact<D = any> = P.ClipboardTransformCellValuePro<D, R>;
export type ClipboardTransformCopyParamsProReact<D = any> = P.ClipboardTransformCopyParamsPro<D, R>;
export type ClipboardTransformPasteParamsProReact<D = any> = P.ClipboardTransformPasteParamsPro<
  D,
  R
>;
export type ClipboardTransformHeaderGroupProReact<D = any> = P.ClipboardTransformHeaderGroupPro<
  D,
  R
>;
export type ClipboardTransformHeaderParamsProReact<D = any> = P.ClipboardTransformHeaderParamsPro<
  D,
  R
>;
export type ClipboardTransformCellValueParamsProReact<D = any> =
  P.ClipboardTransformCellValueParamsPro<D, R>;
export type ClipboardTransformHeaderGroupParamsProReact<D = any> =
  P.ClipboardTransformHeaderGroupParamsPro<D, R>;

export type OverlayIdProReact = P.OverlayIdPro;
export type OverlayProReact<D = any> = P.OverlayPro<D, R>;
export type OverlaysProReact<D = any> = P.OverlaysPro<D, R>;
export type OverlayRendererParamsProReact<D = any> = P.OverlayRendererParamsPro<D, R>;

export type ContextMenuGridTargetsProReact = P.ContextMenuGridTargetsPro;
export type ContextMenuRendererProReact<D = any> = P.ContextMenuRendererPro<D, R>;
export type ContextMenuRendererParamsProReact<D = any> = P.ContextMenuRendererParamsPro<D, R>;
export type TargetProReact = P.TargetPro;

export type ColumnMenuRendererParamsProReact<D = any> = P.ColumnMenuRendererParamsPro<D, R>;
export type ColumnMenuRendererProReact<D = any> = P.ColumnMenuRendererPro<D, R>;

export type ColumnPivotEventParamsProReact<D = any> = P.ColumnPivotEventParamsPro<D, R>;
export type ColumnPivotEventProReact<D = any> = P.ColumnPivotEventPro<D, R>;

export type DialogFrameComponentParamsProReact<D = any> = P.DialogFrameComponentParamsPro<D, R>;
export type DialogFrameComponentProReact<D = any> = P.DialogFrameComponentPro<D, R>;
export type DialogFrameProReact<D = any> = P.DialogFramePro<D, R>;

export type PanelFrameComponentParamsProReact<D = any> = P.PanelFrameComponentParamsPro<D, R>;
export type PanelFrameComponentProReact<D = any> = P.PanelFrameComponentPro<D, R>;
export type PanelFrameProReact<D = any> = P.PanelFramePro<D, R>;

export type PopoverFrameComponentParamsProReact<D = any> = P.PopoverFrameComponentParamsPro<D, R>;
export type PopoverFrameComponentProReact<D = any> = P.PopoverFrameComponentPro<D, R>;
export type PopoverFrameProReact<D = any> = P.PopoverFramePro<D, R>;

export type MenuFrameComponentParamsProReact<D = any> = P.MenuFrameComponentParamsPro<D, R>;
export type MenuFrameComponentProReact<D = any> = P.MenuFrameComponentPro<D, R>;
export type MenuFrameProReact<D = any> = P.MenuFramePro<D, R>;
