import {
  getNearestFocusable,
  getPositionFromFocusable,
  rowIsAggregated,
  rowIsBranch,
  rowIsExpandable,
  rowIsExpanded,
  rowIsLeaf,
  type RowSource,
  type Writable,
} from "@1771technologies/lytenyte-shared";
import type { RefObject } from "react";
import type { EditContext } from "../../root-context.js";
import type { Root } from "../../root.js";
import { useColumnToggleGroup } from "./api-functions/use-column-toggle-group.js";
import { useExportData } from "./api-functions/use-export-data.js";
import { useRowHandleSelect } from "./api-functions/use-row-handle-select.js";
import { useRowSelect } from "./api-functions/use-row-select.js";
import { useEditEnd } from "./api-functions/use-edit-end.js";
import { useEditBegin } from "./api-functions/use-edit-begin.js";
import { useEditIsCellActive } from "./api-functions/use-edit-is-cell-active.js";
import { useEditUpdateRows } from "./api-functions/use-edit-update-rows.js";
import { useColumnUpdate } from "./api-functions/use-column-update.js";
import { useColumnAutosize } from "./api-functions/use-column-autosize.js";
import { useColumnResize } from "./api-functions/use-column-resize.js";
import { useColumnById } from "./api-functions/use-column-by-id.js";
import { useColumnByIndex } from "./api-functions/use-column-by-index.js";
import { useColumnMove } from "./api-functions/use-column-move.js";
import { useColumnField } from "./api-functions/use-column-field.js";
import { useCellRoot } from "./api-functions/use-cell-root.js";
import { useScrollIntoView } from "./api-functions/use-scroll-into-view.js";
import { useRowDetailHeight } from "./api-functions/use-row-detail-height.js";
import { useRowDetailExpanded } from "./api-functions/use-row-detail-expanded.js";
import { useRowGroupToggle } from "./api-functions/use-row-group-toggle.js";
import { useUseRowDrag } from "./api-functions/use-row-drag.js";
import { useViewport } from "./api-functions/use-viewport.js";
import { useProps } from "./api-functions/use-props.js";
import { useRowDetailToggle } from "./api-functions/use-row-detail-toggle.js";
import { usePiece } from "../../../hooks/use-piece.js";
import { useEditUpdateCells } from "./api-functions/use-edit-update-cells.js";
import { useEvent } from "../../../internal.js";
import { useCellSelections } from "./api-functions/use-cell-selections.js";
import { useXCoordinates, useYCoordinates } from "../../contexts/coordinates.js";
import { useViewportContext } from "../../contexts/viewport/viewport-context.js";
import { useRowCountsContext } from "../../contexts/grid-areas/row-counts-context.js";
import { useColumnsContext } from "../../contexts/columns/column-context.js";
import { useRowDetailContext } from "../../contexts/state/row-detail.js";
import { useRowLayoutContext } from "../../contexts/row-layout/row-layout-context.js";
import { useBoundsContext } from "../../contexts/bounds.js";
import { useHeaderLayoutContext } from "../../contexts/header-layout.js";
import { useCellRangeSelection } from "../../contexts/cell-range-selection/cell-range-selection-state.js";
import { useGridIdContext } from "../../contexts/grid-id.js";

export function useApi(
  props: Root.Props,
  source: RowSource,
  edit: EditContext,
  selectPivot: RefObject<number | null>,
  providedApi: Root.API,
) {
  const api: Writable<Root.API> = providedApi;

  const gridId = useGridIdContext();
  const rowLayout = useRowLayoutContext();
  const bounds = useBoundsContext();
  const rc = useRowCountsContext();
  const { totalHeaderHeight } = useHeaderLayoutContext();
  const { cellSelections } = useCellRangeSelection();

  const { view, onColumnsChange, columnGroupExpansions, onColumnGroupExpansionChange } = useColumnsContext();
  const { rowCount, topCount: rowTopCount, bottomCount: rowBottomCount } = rc;

  const xPositions = useXCoordinates();
  const yPositions = useYCoordinates();
  const { viewport: vp } = useViewportContext();

  const { detailExpansions, detailCache, onRowDetailExpansionsChange } = useRowDetailContext();

  api.rowView = useEvent(() => rc);
  api.columnView = useEvent(() => view);

  api.xPositions$ = usePiece(xPositions);
  api.yPositions$ = usePiece(yPositions);
  api.viewport$ = usePiece(vp);

  api.rowIsLeaf = rowIsLeaf;
  api.rowIsGroup = rowIsBranch;
  api.rowIsAggregated = rowIsAggregated;
  api.rowIsExpandable = rowIsExpandable;
  api.rowIsExpanded = rowIsExpanded;

  api.columnToggleGroup = useColumnToggleGroup(
    props.columnGroupJoinDelimiter,
    props.columnGroupDefaultExpansion,
    columnGroupExpansions,
    onColumnGroupExpansionChange,
  );
  api.exportData = useExportData(view, source, api, rowCount);
  api.rowHandleSelect = useRowHandleSelect(props, api, gridId, selectPivot);
  api.rowSelect = useRowSelect(props, api, source);

  api.editEnd = useEditEnd(edit);
  api.editBegin = useEditBegin(props, api, view, edit, vp, gridId);
  api.editIsCellActive = useEditIsCellActive(api, edit);
  api.editUpdateRows = useEditUpdateRows(props, api, source);
  api.editUpdateCells = useEditUpdateCells(props, api, source, view);
  api.columnUpdate = useColumnUpdate(
    view,
    props.columns ?? [],
    onColumnsChange,
    props.onRowGroupColumnChange,
  );
  api.columnAutosize = useColumnAutosize(props, api, bounds, view, rowCount, rowBottomCount, rowTopCount);

  api.columnResize = useColumnResize(api);
  api.columnById = useColumnById(view);
  api.columnByIndex = useColumnByIndex(view);
  api.columnMove = useColumnMove(view, props.columns ?? [], onColumnsChange);

  api.columnField = useColumnField(view);

  api.positionFromElement = useEvent((el: HTMLElement) => {
    const focusable = getNearestFocusable(gridId, el);
    if (!focusable) return null;

    return getPositionFromFocusable(gridId, focusable);
  });

  api.cellSelections = useCellSelections(cellSelections);

  api.cellRoot = useCellRoot(rowLayout);

  api.scrollIntoView = useScrollIntoView(
    props,
    vp,
    view,
    xPositions,
    yPositions,
    rowCount,
    rowBottomCount,
    rowTopCount,
    totalHeaderHeight,
  );

  api.rowDetailHeight = useRowDetailHeight(
    props.rowDetailHeight,
    props.rowDetailAutoHeightGuess,
    detailExpansions,
    detailCache,
  );

  api.rowDetailExpanded = useRowDetailExpanded(detailExpansions, source);
  api.rowDetailToggle = useRowDetailToggle(api, detailExpansions, onRowDetailExpansionsChange);
  api.rowGroupToggle = useRowGroupToggle(source);
  api.useRowDrag = useUseRowDrag(api, gridId);
  api.viewport = useViewport(vp);
  api.props = useProps(props);

  Object.assign(api, source);
}
