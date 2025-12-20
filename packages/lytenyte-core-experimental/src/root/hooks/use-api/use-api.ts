import {
  columnScrollIntoViewValue,
  CONTAINS_DEAD_CELLS,
  FULL_WIDTH,
  get,
  getFirstTabbable,
  getNearestRow,
  getRowIndexFromEl,
  GROUP_COLUMN_PREFIX,
  queryCell,
  rowScrollIntoViewValue,
  runWithBackoff,
  updateLayout,
  type ColumnAbstract,
  type ColumnView,
  type LayoutState,
  type RowNode,
  type RowSource,
  type SpanLayout,
} from "@1771technologies/lytenyte-shared";
import type { API, Props } from "../../../types/types-internal";
import type { RefObject } from "react";
import { useEvent } from "../../../hooks/use-event.js";
import { getSpanFn } from "../use-row-layout/get-span-fn.js";
import { getFullWidthFn } from "../use-row-layout/get-full-width-fn.js";
import { resolveColumn } from "./resolve-column.js";
import type { Controlled } from "../use-controlled-grid-state.js";
import { defaultAutosize, defaultAutosizeHeader } from "./autosizers.js";
import type { EditContext } from "../../root-context";
import type { Root } from "../../root";

type Writable<T> = { -readonly [k in keyof T]: T[k] };

export function useApi(
  gridId: string,
  props: Props,
  source: RowSource,
  view: ColumnView,
  controlled: Controlled,
  edit: EditContext,
  selectPivot: RefObject<number | null>,
  bounds: SpanLayout,
  layoutStateRef: RefObject<LayoutState>,

  detailExpansions: Set<string>,
  detailHeightCache: Record<string, number>,
  vp: HTMLElement | null,
  xPositions: Uint32Array,
  yPositions: Uint32Array,
  headerHeightTotal: number,
  providedApi: API,
) {
  const api: Writable<API> = providedApi;
  const rowTopCount = source.useTopCount();
  const rowBottomCount = source.useBottomCount();
  const rowCount = source.useRowCount();

  api.rowHandleSelect = useEvent((params) => {
    const mode = props.rowSelectionMode ?? "none";
    if (mode === "none") return;

    const rowEl = getNearestRow(gridId, params.target as HTMLElement);
    if (!rowEl) return;

    const selectIndex = getRowIndexFromEl(rowEl);
    const row = api.rowByIndex(selectIndex).get();
    if (!row) return;

    if (mode === "single") {
      api.rowSelect({ selected: row.id, deselect: api.rowIsSelected(row.id) });
      return;
    }

    if (mode === "multiple") {
      const pivotRow = selectPivot.current != null ? api.rowByIndex(selectPivot.current).get() : null;
      if (params.shiftKey && pivotRow) {
        // If the pivot row is not selected then it must've been deselected last.
        const isDeselect = !api.rowIsSelected(pivotRow.id);
        api.rowSelect({ selected: [row.id, pivotRow.id], deselect: isDeselect });
      } else {
        selectPivot.current = selectIndex;
        api.rowSelect({ selected: row.id, deselect: api.rowIsSelected(row.id) });
      }
    }
  });

  api.rowSelect = useEvent(({ selected, deselect = false }) => {
    if (selected === "all") {
      let stop = false;
      const preventDefault = () => (stop = true);
      props.onRowSelect?.({ api, deselect, rows: selected, preventDefault });
      if (stop) return;

      source.onRowsSelected({ selected: "all", deselect, mode: props.rowSelectionMode ?? "none" });

      return;
    }

    let rows: string[];
    if (typeof selected === "string") rows = [selected];
    else if (Array.isArray(selected)) rows = api.rowsBetween(selected[0], selected[1]);
    else rows = [...selected];

    let stop = false;
    const preventDefault = () => (stop = true);
    props.onRowSelect?.({ api, deselect, rows, preventDefault });
    if (stop) return;

    source.onRowsSelected({ selected: rows, deselect, mode: props.rowSelectionMode ?? "none" });
  });

  api.editEnd = useEvent((cancel) => {
    if (cancel) {
      edit.cancel();
      return true;
    }
    return edit.commit();
  });

  api.editBegin = useEvent(({ init, column: c, rowIndex, focusIfNotEditable }) => {
    const row = api.rowByIndex(rowIndex).get();
    const column =
      typeof c === "number"
        ? api.columnByIndex(c)
        : typeof c === "string"
          ? api.columnById(c)
          : api.columnById(c.id);

    const columnIndex = view.visibleColumns.findIndex((x) => x.id === column?.id);

    if (!vp || !row || !column || columnIndex == -1 || props.rowFullWidthPredicate?.({ rowIndex, row, api }))
      return;

    // If there is already an active edit commit it.
    edit.commit();

    const base = props.columnBase as Root.Column;
    const editable = column.editable ?? base.editable;
    if (
      typeof editable === "function"
        ? !editable({ api, row, column, colIndex: columnIndex, rowIndex })
        : !editable
    ) {
      if (focusIfNotEditable) {
        api.scrollIntoView({ column, row: rowIndex, behavior: "instant" });
        runWithBackoff(() => {
          const cell = queryCell(gridId, rowIndex, columnIndex, vp);
          if (!cell) return false;

          cell.focus();
          return true;
        }, [8, 16, 32, 64, 128]);
      }

      return;
    }

    edit.activeEdit.set({ rowId: row.id, column: column.id });
    edit.editData.set(init ?? row.data);

    api.scrollIntoView({ column, row: rowIndex, behavior: "instant" });
    runWithBackoff(() => {
      const cell = queryCell(gridId, rowIndex, columnIndex, vp);
      if (!cell || cell.getAttribute("data-ln-edit-active") !== "true") return false;

      const first = getFirstTabbable(cell, false);
      if (!first) return false;

      first.focus();

      return true;
    }, [8, 16, 32, 64, 128]);
  });

  api.editIsCellActive = useEvent(({ column: c, rowIndex }) => {
    const row = api.rowByIndex(rowIndex);
    const column =
      typeof c === "number"
        ? api.columnByIndex(c)
        : typeof c === "string"
          ? api.columnById(c)
          : api.columnById(c.id);

    if (!row || !column) return false;

    const active = edit.activeEdit.get();
    return active?.column === column.id && active.rowId === row.get()?.id;
  });

  api.editUpdate = useEvent((param) => {
    const updateMap = new Map<RowNode<any>, any>();

    const errors = new Map<number | string, boolean | Record<string, unknown>>();

    const validator = props.editRowValidatorFn as Root.Props["editRowValidatorFn"];
    for (const [key, data] of param) {
      const row = typeof key === "number" ? api.rowByIndex(key).get() : api.rowById(key);

      if (!row) {
        errors.set(key, false);
        continue;
      }

      if (validator) {
        const valid = validator({ api, editData: data, row });
        if (!valid) {
          errors.set(key, valid);
          continue;
        }
      }
      updateMap.set(row, data);
    }

    if (errors.size) return errors;

    source.onRowsUpdated(updateMap);
    return true;
  });

  api.columnUpdate = useEvent((updates) => {
    const columns = [...controlled.columns];

    const groupColumns = view.visibleColumns.filter((c) => c.id.startsWith(GROUP_COLUMN_PREFIX));
    const groupColumn = groupColumns[0];

    if (groupColumn) {
      if (updates[groupColumn.id]) {
        const next = { ...groupColumn, ...updates[groupColumn.id] };
        controlled.onRowGroupColumnChange(next);
      }
    }

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];

      if (updates[column.id]) {
        const next = { ...column, ...updates[column.id] };
        columns[i] = next;
      }
    }
    controlled.onColumnsChange(columns);
  });

  api.columnAutosize = (params) => {
    const errorRef = { current: false };

    const columns =
      (params.columns
        ?.map((c) => resolveColumn(c, errorRef, view))
        .map((c) => c && (typeof c === "string" ? api.columnById(c) : c))
        .filter(Boolean) as ColumnAbstract[]) ?? view.visibleColumns;

    if (errorRef.current) {
      console.error("Invalid column autosize column params");
      return {};
    }
    if (columns.length === 0) return {};

    const base = props.columnBase ?? {};
    const result: Record<string, number> = {};

    const rowFirstVisible = bounds.rowCenterStart;
    const rowLastVisible = bounds.rowCenterEnd;

    const rowStart = Math.max(rowFirstVisible, 0);
    const rowEnd = rowLastVisible === 0 ? Math.min(50, rowCount - rowBottomCount) : rowLastVisible;
    calculateWidths(rowStart, rowEnd);
    if (rowTopCount) calculateWidths(0, rowTopCount);
    if (rowBottomCount) calculateWidths(rowCount - rowBottomCount, rowCount);

    if (params?.includeHeader) {
      for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
        const column = columns[columnIndex];

        const autoFn =
          (column as any).autosizeHeaderFn ?? (base as any).autosizeHeaderFn ?? defaultAutosizeHeader;

        const width = autoFn({ api, column: column as any });

        if (width != null) result[column.id] = Math.max(width, result[column.id]);
      }
    }

    if (params?.dryRun) return result;

    const updates = Object.fromEntries(
      Object.entries(result).map(([key, v]) => [key, { width: v }] as const),
    );

    api.columnUpdate(updates);

    return result;

    function calculateWidths(start: number, end: number) {
      for (let rowIndex = start; rowIndex < end; rowIndex++) {
        const row = api.rowByIndex(rowIndex);
        if (!row) continue;

        for (let i = 0; i < columns.length; i++) {
          const column = columns[i];

          const autoFn = (column as any).autosizeCellFn ?? (base as any).autosizeCellFn ?? defaultAutosize;
          const width = autoFn({ column, api, row });
          result[column.id] ??= 0;

          if (width != null) result[column.id] = Math.max(width, result[column.id]);
        }
      }
    }
  };

  api.columnResize = useEvent((updates) => {
    const columnUpdates = Object.fromEntries(
      Object.entries(updates)
        .map(([c, v]) => [c, { width: v }] as const)
        .filter((c) => api.columnById(c[0])),
    );

    api.columnUpdate(columnUpdates);
  });

  api.columnById = useEvent((id) => {
    return view.lookup.get(id) ?? null;
  });
  api.columnByIndex = useEvent((i) => {
    return view.visibleColumns[i] ?? null;
  });
  api.columnMove = useEvent((params) => {
    const errorRef = { current: false };
    const colSet = new Set(
      params.moveColumns.map((c) => {
        return resolveColumn(c, errorRef, view);
      }),
    );
    const dest = resolveColumn(params.moveTarget, errorRef, view);

    if (errorRef.current) return;
    if (colSet.has(dest)) {
      console.error(`Destination column cannot be in the move columns`);
      return;
    }
    const columns = controlled.columns;

    let columnsToMove = columns.filter((c) => colSet.has(c.id));
    const nextColumns = columns.filter((c) => !colSet.has(c.id));
    const indexOfDest = nextColumns.findIndex((c) => c.id === dest);

    const destCol = nextColumns[indexOfDest];

    const offset = params.before ? 0 : 1;

    if (params.updatePinState) columnsToMove = columnsToMove.map((x) => ({ ...x, pin: destCol.pin ?? null }));
    nextColumns.splice(indexOfDest + offset, 0, ...columnsToMove);

    controlled.onColumnsChange(nextColumns);
  });

  api.columnField = useEvent((col, row) => {
    const column = typeof col === "string" ? view.lookup.get(col) : col;
    if (!column) {
      console.error(`Attempting to compute the field of a column that is not defined`, column);
      return null;
    }

    const field = (column as any).field ?? column.id;
    if (row.kind === "branch") {
      if (typeof field === "function") return field({ column, row, api });
      if (!row.data) return null;
      return row.data[column.id];
    }

    if (typeof field === "function") return field({ column, row, api });
    else if (!row.data) return null;
    else if (typeof field === "object") return get(row.data, (field as { path: string }).path);

    return (row.data as any)[field] as unknown;
  });

  api.cellRoot = useEvent((row, column) => {
    const l = layoutStateRef.current;

    const columns = view.visibleColumns;
    const rs = source;
    // Is this a valid position.
    if (row < 0 || row >= rowCount) return null;
    if (column < 0 || column >= columns.length) return null;

    if (!l.computed[row]) {
      updateLayout({
        base: l.base,
        computed: l.computed,
        lookup: l.lookup,
        special: l.special,

        botCount: rowBottomCount,
        topCount: rowTopCount,

        startCount: view.startCount,
        centerCount: view.centerCount,
        endCount: view.endCount,

        computeColSpan: getSpanFn(rs, columns as any, "col", api),
        computeRowSpan: getSpanFn(rs, columns as any, "row", api),

        isFullWidth: getFullWidthFn(rs, props.rowFullWidthPredicate, api),
        isRowCutoff: (r) => {
          const row = rs.rowByIndex(r)?.get();

          return !row || row.kind === "branch" || detailExpansions.has(row.id);
        },

        rowStart: row,
        rowEnd: row + 1,
        rowMax: rowCount - rowBottomCount,
        rowScanDistance: props.rowScanDistance ?? 100,
      });
    }

    const status = l.special[row];
    if (status === FULL_WIDTH) {
      return { kind: "full-width", rowIndex: row, colIndex: 0 };
    }

    if (status === CONTAINS_DEAD_CELLS) {
      const spec = l.lookup.get(row);

      // This cell is not covered
      if (!spec || spec[column * 4] > 0) {
        return { kind: "cell", rowIndex: row, colIndex: column, root: null };
      }

      const rowIndex = spec[column * 4 + 2];
      const colIndex = spec[column * 4 + 3];

      const rootSpec = l.lookup.get(rowIndex)!;
      const rowSpan = rootSpec[colIndex * 4];
      const colSpan = rootSpec[colIndex * 4 + 1];

      return {
        kind: "cell",
        rowIndex: row,
        colIndex: column,
        root: { colIndex, colSpan, rowIndex, rowSpan },
      };
    }

    return { kind: "cell", rowIndex: row, colIndex: column, root: null };
  });

  api.scrollIntoView = useEvent((opts) => {
    if (!vp) return;

    let x: number | undefined = undefined;
    let y: number | undefined = undefined;
    const col = opts.column;
    if (col != null) {
      let colIndex: number;
      if (typeof col === "number") colIndex = col;
      else if (typeof col === "string") colIndex = view.visibleColumns.findIndex((c) => c.id === col);
      else colIndex = view.visibleColumns.findIndex((c) => c.id === col.id);

      if (colIndex !== -1) {
        x = columnScrollIntoViewValue({
          centerCount: view.centerCount,
          startCount: view.startCount,
          endCount: view.endCount,
          columnIndex: colIndex,
          columnPositions: xPositions,
          viewport: vp,
        });
      }
    }

    const row = opts.row;
    if (row != null) {
      y = rowScrollIntoViewValue({
        bottomCount: rowBottomCount,
        topCount: rowTopCount,
        rowCount: rowCount,
        headerHeight: headerHeightTotal,
        rowIndex: row,
        rowPositions: yPositions,
        viewport: vp,
      });
    }

    vp.scrollTo({
      left: x != null ? x * (props.rtl ? -1 : 1) : undefined,
      top: y,
      behavior: opts.behavior ?? "auto",
    });
  });

  api.rowDetailHeight = useEvent((rowOrId) => {
    const id = typeof rowOrId === "string" ? rowOrId : rowOrId.id;

    if (!detailExpansions.has(id)) return 0;
    if (props.rowDetailHeight === "auto")
      return detailHeightCache[id] ?? props.rowDetailAutoHeightGuess ?? 200;
    return props.rowDetailHeight ?? 200;
  });

  api.rowDetailExpanded = useEvent((row) => {
    if (typeof row === "string") return detailExpansions.has(row);
    if (typeof row === "number") {
      const r = source.rowByIndex(row).get();
      return r == null ? false : detailExpansions.has(r.id);
    }
    return detailExpansions.has(row.id);
  });

  api.rowGroupToggle = useEvent((rowOrId, state) => {
    const rowId = typeof rowOrId === "string" ? rowOrId : rowOrId.id;
    const row = source.rowById(rowId);
    if (!row || row.kind !== "branch") return;

    const next = state ?? !source.rowGroupIsExpanded(row.id);
    const change = { [row.id]: next };
    source.onRowGroupExpansionsChange(change);
    props.onRowGroupExpansionChange?.(change);
  });

  api.viewport = useEvent(() => {
    return vp;
  });

  api.props = useEvent(() => props as any);

  Object.assign(api, source);
}
