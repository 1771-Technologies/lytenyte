import { useEffect } from "react";
import { useGrid } from "../use-grid";

export function RowHoverDriver() {
  const s = useGrid();
  const grid = s.state.internal.viewport.use();

  const hoveredRow = s.state.internal.hoveredRow.use();

  useEffect(() => {
    if (hoveredRow == null || !grid) return;

    const cells = Array.from(
      grid.querySelectorAll(`div > div > .lng1771-cell[aria-rowindex="${hoveredRow + 1}"]`),
    ) as HTMLElement[];

    cells.forEach((c) => {
      if (c.classList.contains(".lng1771-cell--selected"))
        c.style.backgroundColor = "var(--lng1771-primary-30)";
      else c.style.backgroundColor = "var(--lng1771-gray-10)";
    });

    return () => {
      cells.forEach((c) => {
        c.style.removeProperty("background-color");
      });
    };
  }, [grid, hoveredRow]);

  if (hoveredRow == null) return;

  return <></>;
}
