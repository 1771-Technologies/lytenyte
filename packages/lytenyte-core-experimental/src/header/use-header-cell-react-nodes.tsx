import { useMemo, type ReactNode } from "react";
import type { HeaderLayoutCell } from "../layout.js";
import { HeaderRowContext } from "./header-row/context.js";

export function useHeaderCellReactNodes(
  headerLayoutRows: HeaderLayoutCell<any>[][],
  children: (cells: HeaderLayoutCell<any>[]) => ReactNode,
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
