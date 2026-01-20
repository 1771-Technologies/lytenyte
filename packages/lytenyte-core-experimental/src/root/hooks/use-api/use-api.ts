import {
  type ColumnView,
  type LayoutState,
  type RowSource,
  type SpanLayout,
  type Writable,
} from "@1771technologies/lytenyte-shared";
import type { RefObject } from "react";
import type { Controlled } from "../use-controlled-grid-state.js";
import type { EditContext } from "../../root-context.js";
import type { Root } from "../../root.js";
import { useRowIsLeaf } from "./api-functions/use-row-is-leaf.js";
import { useRowIsGroup } from "./api-functions/use-row-is-group.js";
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
import { useRowIsAggregated } from "./api-functions/use-row-is-aggregated.js";
import { useRowIsExpandable } from "./api-functions/use-row-is-expandable.js";
import { useRowIsExpanded } from "./api-functions/use-row-is-expanded.js";
import { useRowDetailToggle } from "./api-functions/use-row-detail-toggle.js";
import { usePiece } from "../../../hooks/use-piece.js";
import { useRowView } from "./api-functions/use-row-view.js";
import { useColumnView } from "./api-functions/use-column-view.js";
import { useEditUpdateCells } from "./api-functions/use-edit-update-cells.js";

export function useApi(
  gridId: string,
  props: Root.Props,
  source: RowSource,
  view: ColumnView,
  controlled: Controlled,
  edit: EditContext,
  selectPivot: RefObject<number | null>,
  bounds: SpanLayout,
  layoutStateRef: RefObject<LayoutState>,
  detailHeightCache: Record<string, number>,
  vp: HTMLElement | null,
  xPositions: Uint32Array,
  yPositions: Uint32Array,
  headerHeightTotal: number,
  providedApi: Root.API,
) {
  const api: Writable<Root.API> = providedApi;
  const rowTopCount = source.useTopCount();
  const rowBottomCount = source.useBottomCount();
  const rowCount = source.useRowCount();

  const x$ = usePiece(xPositions);
  const y$ = usePiece(yPositions);
  const v$ = usePiece(vp);

  api.rowView = useRowView(rowCount, rowBottomCount, rowTopCount);
  api.columnView = useColumnView(view);

  api.xPositions$ = x$;
  api.yPositions$ = y$;
  api.viewport$ = v$;

  api.rowIsLeaf = useRowIsLeaf();
  api.rowIsGroup = useRowIsGroup();
  api.rowIsAggregated = useRowIsAggregated();
  api.rowIsExpandable = useRowIsExpandable();
  api.rowIsExpanded = useRowIsExpanded();
  api.columnToggleGroup = useColumnToggleGroup(props, controlled);
  api.exportData = useExportData(view, source, api, rowCount);
  api.rowHandleSelect = useRowHandleSelect(props, api, gridId, selectPivot);
  api.rowSelect = useRowSelect(props, api, source);

  api.editEnd = useEditEnd(edit);
  api.editBegin = useEditBegin(props, api, view, edit, vp, gridId);
  api.editIsCellActive = useEditIsCellActive(api, edit);
  api.editUpdateRows = useEditUpdateRows(props, api, source);
  api.editUpdateCells = useEditUpdateCells(props, api, source, view);
  api.columnUpdate = useColumnUpdate(view, controlled);
  api.columnAutosize = useColumnAutosize(props, api, bounds, view, rowCount, rowBottomCount, rowTopCount);

  api.columnResize = useColumnResize(api);
  api.columnById = useColumnById(view);
  api.columnByIndex = useColumnByIndex(view);
  api.columnMove = useColumnMove(view, controlled);

  api.columnField = useColumnField(view);

  api.cellRoot = useCellRoot(
    props,
    api,
    view,
    source,
    rowCount,
    rowBottomCount,
    rowTopCount,
    controlled,
    layoutStateRef,
  );

  api.scrollIntoView = useScrollIntoView(
    props,
    vp,
    view,
    xPositions,
    yPositions,
    rowCount,
    rowBottomCount,
    rowTopCount,
    headerHeightTotal,
  );

  api.rowDetailHeight = useRowDetailHeight(props, controlled, detailHeightCache);
  api.rowDetailExpanded = useRowDetailExpanded(controlled, source);
  api.rowDetailToggle = useRowDetailToggle(api, controlled);
  api.rowGroupToggle = useRowGroupToggle(source);
  api.useRowDrag = useUseRowDrag(api, gridId);
  api.viewport = useViewport(vp);
  api.props = useProps(props);

  Object.assign(api, source);
}
