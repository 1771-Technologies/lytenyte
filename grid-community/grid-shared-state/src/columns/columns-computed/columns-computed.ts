import { signal } from "@1771technologies/react-cascada";
import { columnsByPin } from "@1771technologies/grid-core";
import type {
  ApiCommunity,
  ApiEnterprise,
  ColumnCommunity,
  ColumnEnterprise,
} from "@1771technologies/grid-types";
import { containsADuplicateId } from "@1771technologies/js-utils";
import { columnHandleGroupColumn } from "./column-handle-group-column";
import { columnHandleMarker } from "./column-handle-marker-column";
import { columnHandleTreeData } from "./column-handle-tree-data";

export function columnsComputed<D, E>(
  rawColumns: ColumnCommunity<D, E>[] | ColumnEnterprise<D, E>[],
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  pivots: boolean = false,
) {
  rawColumns = rawColumns as ColumnCommunity<D, E>[];
  api = api as ApiCommunity<D, E>;

  const processColumns = (c: ColumnCommunity<D, E>[]) => {
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
      rowDetailEnabled: sx.rowDetailPredicate.get() !== false,
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
    postUpdate: () => !pivots && api.cellEditEndAll(true),
    bind: (v) => {
      return processColumns(v);
    },
  });

  return columns as any;
}
