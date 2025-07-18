import {
  computePathTable,
  getMaxHeaderDepth,
  getVisibleColumns,
  getVisibleColumnsWithGroups,
  makeColumnGroupMetadata,
  partitionColumnsByPinState,
  type PathTableItem,
} from "@1771technologies/lytenyte-shared";
import type { Column, ColumnBase } from "../../+types";

export interface MakeColumnViewArgs<T> {
  readonly columns: Column<T>[];
  readonly base: ColumnBase<T>;

  readonly groupExpansions: Record<string, boolean>;
  readonly groupJoinDelimiter: string;
  readonly groupExpansionDefault: boolean;
}

export function makeColumnView<T>({
  columns,
  base,
  groupExpansions,
  groupJoinDelimiter,
  groupExpansionDefault,
}: MakeColumnViewArgs<T>) {
  const lookup = new Map(columns.map((c) => [c.id, c]));

  const columnsNotHidden = getVisibleColumns(columns, base);
  const groupMetadata = makeColumnGroupMetadata(columnsNotHidden, groupJoinDelimiter);

  const visible = getVisibleColumnsWithGroups(
    columnsNotHidden,
    groupMetadata,
    groupExpansions,
    groupExpansionDefault,
  );

  const { start, center, end } = partitionColumnsByPinState(visible);

  const seenMap: Record<string, number> = {};
  const maxDepth = getMaxHeaderDepth(visible);

  const endOffset = start.length + center.length;

  const startTable = computePathTable(start, maxDepth, seenMap, groupJoinDelimiter, 0).table;
  const centerTable = computePathTable(
    center,
    maxDepth,
    seenMap,
    groupJoinDelimiter,
    start.length,
  ).table;
  const endTable = computePathTable(end, maxDepth, seenMap, groupJoinDelimiter, endOffset).table;

  const combinedView: PathTableItem<Column<T>>[][] = [];
  for (let i = 0; i <= maxDepth; i++) {
    const row: PathTableItem<Column<T>>[] = [];

    row.push(...(startTable[i] ?? []));
    row.push(...(centerTable[i] ?? []));
    row.push(...(endTable[i] ?? []));

    combinedView.push(row);
  }

  return {
    meta: groupMetadata,
    maxRow: maxDepth + 1,
    maxCol: visible.length,
    combinedView,
    visibleColumns: [...start, ...center, ...end],
    lookup,
    startCount: start.length,
    endCount: end.length,
    centerCount: center.length,
  };
}
