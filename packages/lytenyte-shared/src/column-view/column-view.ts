import type { ColumnAbstract } from "../types.js";
import type { PathTableItem } from "../path/+types.path-table.js";
import type { ColumnView } from "./types.js";
import { buildSectionTable } from "./build-section-table.js";
import { itemsWithIdToMap } from "../js-utils/items-with-id-to-map.js";

export interface MakeColumnView2Args {
  readonly columns: ColumnAbstract[];
  readonly base: Omit<ColumnAbstract, "id">;
  readonly groupExpansions: Record<string, boolean>;
  readonly groupJoinDelimiter: string;
  readonly groupExpansionDefault: boolean;
  readonly filledDepth: boolean;
  readonly lastGroupShouldFill: boolean;
}

export function makeColumnView2({
  columns,
  base,
  groupExpansions,
  groupJoinDelimiter,
  groupExpansionDefault,
  filledDepth,
  lastGroupShouldFill,
}: MakeColumnView2Args): ColumnView {
  // We start by filtering the hidden columns. Hidden columns do not contribute to the visible
  // hierarchy, so these can safely be removed.
  const candidates: ColumnAbstract[] = [];
  for (let i = 0; i < columns.length; i++) {
    if (!(columns[i].hide ?? base.hide)) candidates.push(columns[i]);
  }

  const collapsibilityInfo: Record<string, { open: boolean; close: boolean }> = {};
  const colIdToGroupIds = new Map<string, string[]>();
  const validGroupIds = new Set<string>();

  for (const c of candidates) {
    if (!c.groupPath?.length) continue;

    const groupIds: string[] = [];
    const directParentDepth = c.groupPath.length - 1;
    let id = "";

    for (let d = 0; d < c.groupPath.length; d++) {
      if (d > 0) id += groupJoinDelimiter;
      id += c.groupPath[d];

      groupIds.push(id);
      validGroupIds.add(id);
      collapsibilityInfo[id] ??= { open: false, close: false };

      if (d === directParentDepth) {
        const vis = c.groupVisibility ?? "open";
        if (vis === "open") collapsibilityInfo[id].close = true;
        else collapsibilityInfo[id].open = true;
      } else {
        // Deeper descendant: always hidden when ancestor collapses
        collapsibilityInfo[id].close = true;
      }
    }

    colIdToGroupIds.set(c.id, groupIds);
  }

  const groupIsCollapsible = new Map<string, boolean>(
    Object.entries(collapsibilityInfo).map(([gid, info]) => [gid, info.open && info.close]),
  );

  const meta = { colIdToGroupIds, validGroupIds, groupIsCollapsible };

  // Step 3: Filter by group expansion state
  // groupVisibility applies only to the direct parent; ancestor collapse always hides the column.
  const visibleColumns: ColumnAbstract[] = [];
  for (const c of candidates) {
    if (!c.groupPath?.length) {
      visibleColumns.push(c);
      continue;
    }

    const groupIds = colIdToGroupIds.get(c.id)!;
    const directParentDepth = c.groupPath.length - 1;
    let include = true;

    for (let d = 0; d < groupIds.length; d++) {
      if (!groupIsCollapsible.get(groupIds[d])) continue;

      const expanded = groupExpansions[groupIds[d]] ?? groupExpansionDefault;
      if (expanded) continue;

      // This group is collapsed
      if (d < directParentDepth) {
        include = false;
        break;
      } else {
        // Direct parent: check groupVisibility
        const vis = c.groupVisibility ?? "open";
        if (vis === "open") include = false;
        break;
      }
    }

    if (include) visibleColumns.push(c);
  }

  // Step 4: Compute maxDepth
  // filledDepth=true uses candidates (all non-hidden); false uses post-expansion visible columns
  const depthSource = filledDepth ? candidates : visibleColumns;
  let maxDepth = 0;
  for (const c of depthSource) {
    const d = c.groupPath?.length ?? 0;
    if (d > maxDepth) maxDepth = d;
  }

  // Step 5: Partition visible columns by pin state
  // Pin sections act as group separators in the hierarchy
  const start: ColumnAbstract[] = [];
  const center: ColumnAbstract[] = [];
  const end: ColumnAbstract[] = [];
  for (const c of visibleColumns) {
    if (c.pin === "start") start.push(c);
    else if (c.pin === "end") end.push(c);
    else center.push(c);
  }

  // Step 6: Build combinedView — each section processed independently,
  // then merged side-by-side row by row
  const seenMap: Record<string, number> = {};
  const endOffset = start.length + center.length;

  const startTable = buildSectionTable(start, maxDepth, lastGroupShouldFill, seenMap, groupJoinDelimiter, 0);
  const centerTable = buildSectionTable(
    center,
    maxDepth,
    lastGroupShouldFill,
    seenMap,
    groupJoinDelimiter,
    start.length,
  );
  const endTable = buildSectionTable(
    end,
    maxDepth,
    lastGroupShouldFill,
    seenMap,
    groupJoinDelimiter,
    endOffset,
  );

  const combinedView: PathTableItem<ColumnAbstract>[][] = [];
  for (let i = 0; i <= maxDepth; i++) {
    const row: PathTableItem<ColumnAbstract>[] = [];
    row.push(...(startTable[i] ?? []));
    row.push(...(centerTable[i] ?? []));
    row.push(...(endTable[i] ?? []));
    combinedView.push(row);
  }

  return {
    meta,
    maxRow: maxDepth + 1,
    maxCol: visibleColumns.length,
    combinedView,
    visibleColumns: [...start, ...center, ...end],
    lookup: itemsWithIdToMap(columns),
    startCount: start.length,
    endCount: end.length,
    centerCount: center.length,
  };
}
