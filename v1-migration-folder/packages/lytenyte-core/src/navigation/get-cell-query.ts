export function getCellQuery(id: string, r: number, c: number) {
  return `[data-ln-row][data-ln-gridid="${id}"] [data-ln-cell][data-ln-rowindex="${r}"][data-ln-colindex="${c}"]`;
}
