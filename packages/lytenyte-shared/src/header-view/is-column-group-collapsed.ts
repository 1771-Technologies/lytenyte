export function isColumnGroupCollapsed(
  groupIds: string[],
  groupExpansions: Record<string, boolean>,
  groupDefaultExpansion: boolean,
  groupCollapsibleLookup: Map<string, boolean>,
) {
  for (const groupId of groupIds) {
    const expansion = groupExpansions[groupId] ?? groupDefaultExpansion;
    const canCollapse = groupCollapsibleLookup.get(groupId)!;

    const isCollapsed = !expansion && canCollapse;

    if (isCollapsed) return true;
  }

  return false;
}
