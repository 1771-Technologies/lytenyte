export function getRowQuery(id: string, r: number) {
  return `[data-ln-row][data-ln-gridid="${id}"][data-ln-rowindex="${r}"]`;
}
