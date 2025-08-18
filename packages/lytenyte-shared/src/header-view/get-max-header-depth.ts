export function getMaxHeaderDepth(columns: { groupPath?: string[] }[]) {
  if (!columns.length) return 0;

  return Math.max(...columns.map((c) => c.groupPath?.length ?? 0));
}
