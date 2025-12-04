import { computeColumnPositions } from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";
import type { Column, ColumnBase } from "../../types/column.js";

export function useXPositions<T>(
  columns: Column<T>[],
  base: ColumnBase<T>,
  containerWidth: number,
  sizeToFit: boolean,
) {
  const xLayout = useMemo(() => {
    const next = computeColumnPositions(columns, base, containerWidth, sizeToFit);

    return next;
  }, [base, columns, containerWidth, sizeToFit]);

  return xLayout;
}
