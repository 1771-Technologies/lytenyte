export function getCellDims(el: HTMLElement) {
  const rowIndex = el.getAttribute("data-ln-rowindex");
  const colIndex = el.getAttribute("data-ln-colindex");
  const rowSpan = el.getAttribute("data-ln-row-span");
  const colSpan = el.getAttribute("data-ln-col-span");

  return {
    rowIndex: Number.parseInt(rowIndex!),
    colIndex: Number.parseInt(colIndex!),
    rowSpan: Number.parseInt(rowSpan!),
    colSpan: Number.parseInt(colSpan!),
  };
}
