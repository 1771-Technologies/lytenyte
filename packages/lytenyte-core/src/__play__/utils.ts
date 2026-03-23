import { wait as w } from "@1771technologies/lytenyte-shared";

export function scrollGrid(grid: any, { x, y }: { x?: number; y?: number }) {
  grid.element().scrollBy({ top: y, left: x });
}
export const wait = w;

export const getCellQuery = (gridId: string, rowIndex: number, colIndex: number) =>
  `[data-ln-gridid="${gridId}"][data-ln-cell="true"][data-ln-rowindex="${rowIndex}"][data-ln-colindex="${colIndex}"]`;

export const getCell = (gridId: string, rowIndex: number, colIndex: number) => {
  return document.querySelector(getCellQuery(gridId, rowIndex, colIndex)) as HTMLElement;
};
