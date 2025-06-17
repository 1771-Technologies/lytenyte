import type { Item } from "./+types";

export function isCollapsed(
  col: Item,
  lookup: Record<string, { open: boolean; close: boolean }>,
  groupExpansions: Record<string, boolean>,
  groupDefaultExpansion: boolean,
  groupDelimiter: string
) {
  if (!col.groupPath?.length) return false;

  let id = "";
  for (let i = 0; i < col.groupPath.length; i++) {
    id += col.groupPath[i];

    const expansion = groupExpansions[id] ?? groupDefaultExpansion;
    const collapseRecord = lookup[id];
    const canCollapse = collapseRecord.close && collapseRecord.open;

    const isCollapsed = !expansion && canCollapse;

    if (isCollapsed) return isCollapsed;

    id += groupDelimiter;
  }

  return false;
}
