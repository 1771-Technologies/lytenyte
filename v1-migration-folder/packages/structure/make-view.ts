import { computePathTable, type PathTableItem } from "../path";
import type { Base, Item, TableView } from "./+types";
import { filterColumnsForCollapsedGroups } from "./filter-columns-for-collapsed-groups";
import { filterHiddenColumns } from "./filter-hidden-columns";
import { getMaxDepth } from "./get-max-depth";
import { splitByPinState } from "./split-by-pin-state";

export interface ViewArgs {
  readonly items: Item[];
  readonly base: Base;
  readonly groupExpansions: Record<string, boolean>;
  readonly groupDefaultExpansion: boolean;
  readonly groupDelimiter: string;
}

export function makeView({
  items,
  base,
  groupDelimiter,
  groupExpansions,
  groupDefaultExpansion,
}: ViewArgs): TableView {
  const visibleOnHide = filterHiddenColumns(items, base);

  const visible = filterColumnsForCollapsedGroups(
    visibleOnHide,
    groupExpansions,
    groupDefaultExpansion,
    groupDelimiter
  );

  const { start, center, end } = splitByPinState(visible);

  const seenMap: Record<string, number> = {};
  const maxDepth = getMaxDepth(visible);

  const startTable = computePathTable(start, maxDepth, seenMap).table;
  const centerTable = computePathTable(center, maxDepth, seenMap).table;
  const endTable = computePathTable(end, maxDepth, seenMap).table;

  const combinedView: PathTableItem<Item>[][] = [];
  for (let i = 0; i <= maxDepth; i++) {
    const row: PathTableItem<Item>[] = [];

    row.push(...(startTable[i] ?? []));
    row.push(...(centerTable[i] ?? []));
    row.push(...(endTable[i] ?? []));

    combinedView.push(row);
  }

  return {
    maxRow: maxDepth + 1,
    maxCol: visible.length,
    view: combinedView,
  };
}
