import { computeColumnPositions, type ColumnView } from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";
import type { Props } from "../../types/types-internal";

export function useXPositions(props: Props, view: ColumnView, containerWidth: number) {
  const xLayout = useMemo(() => {
    const columns = view.visibleColumns;
    const next = computeColumnPositions(
      columns,
      props.columnBase ?? {},
      containerWidth,
      props.columnSizeToFit ?? false,
    );

    return next;
  }, [containerWidth, props.columnBase, props.columnSizeToFit, view.visibleColumns]);

  return xLayout;
}
