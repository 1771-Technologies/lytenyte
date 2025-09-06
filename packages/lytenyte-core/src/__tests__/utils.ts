export function scrollGrid(grid: any, { x, y }: { x?: number; y?: number }) {
  grid.element().scrollBy({ top: y, left: x });
}
