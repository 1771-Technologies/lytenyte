import { createContext, useContext, type PropsWithChildren } from "react";
import type { API, Props } from "../../types/index.js";
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
import type { Root } from "../root.js";
import { useEditContext } from "./edit-context.js";
import { useGridIdContext } from "./grid-id.js";
import { useRowLayoutContext } from "./row-layout/row-layout-context.js";
import { useBoundsContext } from "./bounds.js";
import { useRowCountsContext } from "./grid-areas/row-counts-context.js";
import { useHeaderLayoutContext } from "./header-layout.js";
import { useCellRangeSelection } from "./cell-range-selection/cell-range-selection-state.js";
import { useColumnsContext } from "./columns/column-context.js";
import { useXCoordinates, useYCoordinates } from "./coordinates.js";
import { useViewportContext } from "./viewport/viewport-context.js";
import { useEvent } from "../../hooks/use-event.js";
import { usePiece } from "../../hooks/use-piece.js";
import { useColumnToggleGroup } from "../hooks/use-api/api-functions/use-column-toggle-group.js";
import { useExportData } from "../hooks/use-api/api-functions/use-export-data.js";
import { useRowHandleSelect } from "../hooks/use-api/api-functions/use-row-handle-select.js";
import { useRowSelect } from "../hooks/use-api/api-functions/use-row-select.js";
import { useEditEnd } from "../hooks/use-api/api-functions/use-edit-end.js";
import { useEditBegin } from "../hooks/use-api/api-functions/use-edit-begin.js";
import { useEditIsCellActive } from "../hooks/use-api/api-functions/use-edit-is-cell-active.js";
import { useEditUpdateRows } from "../hooks/use-api/api-functions/use-edit-update-rows.js";
import { useEditUpdateCells } from "../hooks/use-api/api-functions/use-edit-update-cells.js";
import { useColumnUpdate } from "../hooks/use-api/api-functions/use-column-update.js";
import { useColumnAutosize } from "../hooks/use-api/api-functions/use-column-autosize.js";
import { useColumnResize } from "../hooks/use-api/api-functions/use-column-resize.js";
import { useColumnById } from "../hooks/use-api/api-functions/use-column-by-id.js";
import { useColumnByIndex } from "../hooks/use-api/api-functions/use-column-by-index.js";
import { useColumnMove } from "../hooks/use-api/api-functions/use-column-move.js";
import { useColumnField } from "../hooks/use-api/api-functions/use-column-field.js";
import { useCellRoot } from "../hooks/use-api/api-functions/use-cell-root.js";
import { useScrollIntoView } from "../hooks/use-api/api-functions/use-scroll-into-view.js";
import { useRowDetailHeight } from "../hooks/use-api/api-functions/use-row-detail-height.js";
import { useRowDetailExpanded } from "../hooks/use-api/api-functions/use-row-detail-expanded.js";
import { useRowDetailToggle } from "../hooks/use-api/api-functions/use-row-detail-toggle.js";
import { useRowGroupToggle } from "../hooks/use-api/api-functions/use-row-group-toggle.js";
import { useUseRowDrag } from "../hooks/use-api/api-functions/use-row-drag.js";
import { useViewport } from "../hooks/use-api/api-functions/use-viewport.js";
import { useSelectPivotRef } from "./row-select-context.js";
import { useRowDetailContext } from "./row-detail.js";

const context = createContext<API>(null as unknown as API);

export const APIProvider = ({
  api: providedApi,
  source,
  children,
  ...props
}: PropsWithChildren<Props & { api: API; source: RowSource }>) => {
  const api: Writable<Root.API> = providedApi;
  const selectPivot = useSelectPivotRef();
  const edit = useEditContext();

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

  api.cellSelections = useEvent(() => cellSelections);

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
  api.props = useEvent(() => props);

  Object.assign(api, source);

  return <context.Provider value={api}>{children}</context.Provider>;
};

export const useAPI = () => useContext(context);
