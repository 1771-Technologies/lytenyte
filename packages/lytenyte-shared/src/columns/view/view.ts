import { itemsWithIdToMap } from "../../js-utils/index.js";
import type { ColumnAbstract } from "../../types.js";
import { columnGroupMeta, type ColumnGroupMeta } from "../group-meta/column-group-meta.js";
import { maxColumnDepth } from "../max-depth/max-column-depth.js";
import { partitionColumnsByPinState } from "../partition-by-pin/partition-columns-by-pin-state.js";
import { pathTable } from "../path-table/path-table.js";
import type { PathTableItem } from "../path-table/types.path-table.js";
import { visibleColumnsByGroup } from "../visible-columns/visible-columns-by-group.js";

export interface ViewArguments {
  readonly columns: ColumnAbstract[];
  readonly base: Omit<ColumnAbstract, "id">;
  readonly groupExpansions: Record<string, boolean>;
  readonly groupJoinDelimiter: string;
  readonly groupExpansionDefault: boolean;
  readonly filledDepth: boolean;
  readonly lastGroupShouldFill: boolean;
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

/**
 * Computes the full column view from a set of column definitions. Hidden columns are filtered out
 * first, then group metadata is derived from the remaining candidates. The visible columns are
 * further filtered by the current group expansion state, partitioned into start, center, and end
 * pin sections, and laid out into a 2D path table. The returned view contains everything needed
 * to render the column header — the path table, section counts, max dimensions, a lookup of all
 * columns by id, and the group metadata.
 */
export function view({
  columns,
  base,
  groupExpansions,
  groupJoinDelimiter,
  groupExpansionDefault,
  lastGroupShouldFill,
  filledDepth,
}: ViewArguments): ColumnView {
  const candidates = columns.filter((x) => !(x.hide ?? base.hide));

  const meta = columnGroupMeta(candidates, groupJoinDelimiter);
  const visibleColumns = visibleColumnsByGroup(candidates, groupExpansions, groupExpansionDefault, meta);
  const maxDepth = maxColumnDepth(visibleColumns, candidates, filledDepth);
  const partitions = partitionColumnsByPinState(visibleColumns);

  const table = pathTable(partitions, maxDepth, lastGroupShouldFill, groupJoinDelimiter);

  return {
    meta,
    maxRow: maxDepth + 1,
    maxCol: visibleColumns.length,
    combinedView: table,
    visibleColumns: [...partitions.start, ...partitions.center, ...partitions.end],
    lookup: itemsWithIdToMap(columns),
    startCount: partitions.start.length,
    endCount: partitions.end.length,
    centerCount: partitions.center.length,
  };
}
