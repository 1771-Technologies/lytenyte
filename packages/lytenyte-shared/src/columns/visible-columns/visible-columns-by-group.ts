import type { ColumnGroupMeta } from "../../+types.js";
import type { ColumnAbstract } from "../../types.js";

/**
 * This function returns the columns that are visible based on the column group expansion state.
 * It does not handle the column "hide" state. Columns that are hidden should be filtered before
 * passing them to this function.
 */
export function visibleColumnsByGroup(
  candidates: ColumnAbstract[],
  groupExpansions: Record<string, boolean>,
  groupExpansionDefault: boolean,
  { colIdToGroupIds, groupIsCollapsible }: ColumnGroupMeta,
): ColumnAbstract[] {
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

  return visibleColumns;
}
