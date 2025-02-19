import { t } from "@1771technologies/grid-design";
import { useGrid } from "../use-grid";

export function RowHoverDriver() {
  const s = useGrid();
  const gridId = s.state.gridId.use();

  const hoveredRow = s.state.internal.hoveredRow.use();

  if (hoveredRow == null) return;

  return (
    <style>
      {`
      #${gridId} > div > div > [aria-rowindex="${hoveredRow + 1}"] {
        background-color: ${t.rowBgHover};
      }
  `}
    </style>
  );
}
