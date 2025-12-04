import { computeColumnPositions } from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";
import type { Ln } from "../../types";

export function useXPositions<T>(
  columns: Ln.Column<T>[],
  base: Ln.ColumnBase<T>,
  containerWidth: number,
  sizeToFit: boolean,
) {
  const xLayout = useMemo(() => {
    const next = computeColumnPositions(columns, base, containerWidth, sizeToFit);

    return next;
  }, [base, columns, containerWidth, sizeToFit]);

  return xLayout;
}
