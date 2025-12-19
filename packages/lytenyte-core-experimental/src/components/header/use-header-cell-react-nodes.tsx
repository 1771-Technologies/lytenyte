import { useMemo, type ReactNode } from "react";
import { HeaderRowContext } from "./header-row/context.js";
import type { LayoutHeader } from "@1771technologies/lytenyte-shared";

export function useHeaderCellReactNodes(
  headerLayoutRows: LayoutHeader[][],
  children: (cells: LayoutHeader[]) => ReactNode,
) {
  const headerRows = useMemo(() => {
    const rows: ReactNode[] = [];

    for (let i = 0; i < headerLayoutRows.length; i++) {
      const rowCells = headerLayoutRows[i];

      rows.push(
        <HeaderRowContext key={i} value={i}>
          {children(rowCells)}
        </HeaderRowContext>,
      );
    }

    return rows;
  }, [children, headerLayoutRows]);

  return headerRows;
}
