import type { ColumnGroupMeta } from "../+types.js";
import { isColumnGroupCollapsed } from "./is-column-group-collapsed.js";
import type { PartialColumns } from "./make-column-group-metadata.js";

export function getVisibleColumnsWithGroups<T extends PartialColumns>(
  columnsNotHidden: T[],
  meta: ColumnGroupMeta,
  groupExpansions: Record<string, boolean>,
  groupExpansionDefault: boolean,
) {
  const visible: T[] = [];
  for (let i = 0; i < columnsNotHidden.length; i++) {
    const c = columnsNotHidden[i];

    const groupViz = c.groupVisibility ?? "open";
    if (!c.groupPath?.length || groupViz === "always") {
      visible.push(c);
      continue;
    }

    const collapsed = isColumnGroupCollapsed(
      meta.colIdToGroupIds.get(c.id)!,
      groupExpansions,
      groupExpansionDefault,
      meta.groupIsCollapsible,
    );

    if (collapsed && groupViz === "close") visible.push(c);
    if (!collapsed && groupViz === "open") visible.push(c);
  }

  return visible;
}
