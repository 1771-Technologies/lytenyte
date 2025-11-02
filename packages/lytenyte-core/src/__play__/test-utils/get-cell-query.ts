export const getCellQuery = (gridId: string, rowIndex: number, colIndex: number) =>
  `[data-ln-gridid="${gridId}"][data-ln-cell="true"][data-ln-rowindex="${rowIndex}"][data-ln-colindex="${colIndex}"]`;
