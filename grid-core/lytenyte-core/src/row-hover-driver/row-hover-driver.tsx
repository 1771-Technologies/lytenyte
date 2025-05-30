import { useGrid } from "../use-grid";

export function RowHoverDriver() {
  const s = useGrid();
  const gridId = s.state.gridId.use();

  const hoveredRow = s.state.internal.hoveredRow.use();

  if (hoveredRow == null) return;

  return (
    <style>
      {`
      #${gridId} > div > div > :not(.lng1771-cell--selected)[aria-rowindex="${hoveredRow + 1}"] {
        background-color: var(--lng1771-gray-10);
      }
      #${gridId} > div > div > .lng1771-cell--selected[aria-rowindex="${hoveredRow + 1}"] {
        background-color: var(--lng1771-primary-30);
      }
  `}
    </style>
  );
}
