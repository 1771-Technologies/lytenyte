import type { ColumnAbstract } from "../+types.non-gen.js";
import { getMaxHeaderDepth } from "../header-view/get-max-header-depth.js";
import { getVisibleColumns } from "../header-view/get-visible-columns.js";
import { getVisibleColumnsWithGroups } from "../header-view/get-visible-columns-with-groups.js";
import { makeColumnGroupMetadata } from "../header-view/make-column-group-metadata.js";
import { partitionColumnsByPinState } from "../header-view/partition-columns-by-pin-state.js";
import type { PathTableItem } from "../path/+types.path-table.js";
import { computePathTable } from "../path/compute-path-table.js";

interface ColumnGroupMeta {
  readonly colIdToGroupIds: Map<string, string[]>;
  readonly validGroupIds: Set<string>;
  readonly groupIsCollapsible: Map<string, boolean>;
}

export interface ColumnView {
  meta: ColumnGroupMeta;
  maxRow: number;
  maxCol: number;
  combinedView: PathTableItem<ColumnAbstract>[][];
  visibleColumns: ColumnAbstract[];
  lookup: Map<string, ColumnAbstract>;
  startCount: number;
  endCount: number;
  centerCount: number;
}

interface MakeColumnViewArgs {
  readonly columns: ColumnAbstract[];
  readonly base: Omit<ColumnAbstract, "id">;

  readonly groupExpansions: Record<string, boolean>;
  readonly groupJoinDelimiter: string;
  readonly groupExpansionDefault: boolean;
}

export function makeColumnView({
  columns,
  base,
  groupExpansions,
  groupJoinDelimiter,
  groupExpansionDefault,
}: MakeColumnViewArgs): ColumnView {
  const lookup = new Map(columns.map((c) => [c.id, c]));

  const columnsNotHidden = getVisibleColumns(columns, base);
  const groupMetadata = makeColumnGroupMetadata(columnsNotHidden, groupJoinDelimiter);

  const visible = getVisibleColumnsWithGroups(columnsNotHidden, groupMetadata, groupExpansions, groupExpansionDefault);

  const { start, center, end } = partitionColumnsByPinState(visible);

  const seenMap: Record<string, number> = {};
  const maxDepth = getMaxHeaderDepth(visible);

  const endOffset = start.length + center.length;

  const startTable = computePathTable(start, maxDepth, seenMap, groupJoinDelimiter, 0).table;
  const centerTable = computePathTable(center, maxDepth, seenMap, groupJoinDelimiter, start.length).table;
  const endTable = computePathTable(end, maxDepth, seenMap, groupJoinDelimiter, endOffset).table;

  const combinedView: PathTableItem<ColumnAbstract>[][] = [];
  for (let i = 0; i <= maxDepth; i++) {
    const row: PathTableItem<ColumnAbstract>[] = [];

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
