import type { Item } from "./+types";
import { computeCollapsibleLookup } from "./compute-collapsible-lookup";
import { isCollapsed } from "./is-collapsed";

export function filterColumnsForCollapsedGroups(
  visible: Item[],
  groupExpansions: Record<string, boolean>,
  groupDefaultExpansion: boolean,
  groupDelimiter: string
) {
  const collapsible = computeCollapsibleLookup(visible, groupDelimiter);

  const finalVisible: Item[] = [];
  for (let i = 0; i < visible.length; i++) {
    const c = visible[i];

    const visibility = c.groupVisibility ?? "open";
    if (!c.groupPath?.length || c.groupVisibility === "always") {
      finalVisible.push(c);
      continue;
    }

    const collapsed = isCollapsed(
      c,
      collapsible,
      groupExpansions,
      groupDefaultExpansion,
      groupDelimiter
    );

    if (collapsed && visibility === "close") finalVisible.push(c);
    if (!collapsed && visibility === "open") finalVisible.push(c);
  }

  return finalVisible;
}
