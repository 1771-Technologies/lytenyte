import { signal } from "@1771technologies/react-cascada";
import { columnsByPin } from "@1771technologies/grid-core";
import { containsADuplicateId } from "@1771technologies/js-utils";
import { columnHandleGroupColumn } from "./column-handle-group-column";
import { columnHandleMarker } from "./column-handle-marker-column";
import { columnHandleTreeData } from "./column-handle-tree-data";
import type { ApiCore, ColumnCore } from "@1771technologies/grid-types/core";
import type { ApiPro, ColumnPro } from "@1771technologies/grid-types/pro";

export function columnsComputed<D, E>(
  rawColumns: ColumnCore<D, E>[] | ColumnPro<D, E>[],
  api: ApiCore<D, E> | ApiPro<D, E>,
  pivots: boolean = false,
) {
  rawColumns = rawColumns as ColumnCore<D, E>[];
  api = api as ApiCore<D, E>;

  const processColumns = (c: ColumnCore<D, E>[]) => {
    if (containsADuplicateId(c)) {
      console.error(c);
      throw new Error("Duplicate column id detected. Every column should have a unique ID.");
    }
    const sx = api.getState();
    const treeData = ((sx as any)?.treeData?.get() as boolean | undefined) ?? false;

    const rowGroupTemplate = sx.rowGroupColumnTemplate.get() ?? {};

    const columnsWithGroup = columnHandleGroupColumn({
      columns: c,
      rowGroupModel: sx.rowGroupModel.get(),
      rowGroupColumnTemplate: rowGroupTemplate,
      rowGroupDisplayMode: sx.rowGroupDisplayMode.get(),
      treeData: treeData && !pivots,
    });

    const columnsWithTree = columnHandleTreeData(columnsWithGroup, treeData, rowGroupTemplate);

    const columnsWithMarker = columnHandleMarker({
      columns: columnsWithTree,
      rowDetailEnabled: sx.rowDetailEnabled.get() !== false,
      rowDetailMarker: sx.rowDetailMarker.get(),
      rowDragEnabled: sx.rowDragEnabled.get(),
      rowSelectionCheckbox: sx.rowSelectionCheckbox.get(),
      rowSelectionMode: sx.rowSelectionMode.get(),
    });

    const byPin = columnsByPin(columnsWithMarker);

    const final = [...byPin.start, ...byPin.center, ...byPin.end];

    return final;
  };

  const columns = signal(rawColumns, {
    bind: (v) => {
      return processColumns(v);
    },
    postUpdate: () => queueMicrotask(api.rowRefresh),
  });

  return columns as any;
}
