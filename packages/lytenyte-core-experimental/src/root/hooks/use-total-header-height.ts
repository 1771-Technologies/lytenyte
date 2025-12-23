import { useMemo } from "react";
import type { Root } from "../root";

export function useTotalHeaderHeight(props: Root.Props, maxRow: number) {
  const headerHeightTotal = useMemo(() => {
    const headerGroupHeight = props.headerGroupHeight ?? 40;
    const headerHeight = props.headerHeight ?? 40;
    const floatingHeight = props.floatingRowEnabled ? (props.floatingRowHeight ?? 40) : 0;

    return (maxRow - 1) * headerGroupHeight + headerHeight + floatingHeight;
  }, [
    maxRow,
    props.floatingRowEnabled,
    props.floatingRowHeight,
    props.headerGroupHeight,
    props.headerHeight,
  ]);

  return headerHeightTotal;
}
