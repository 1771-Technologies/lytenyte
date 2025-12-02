import { useMemo } from "react";

export function useHeaderHeightTotal(
  headerGroupHeight: number,
  headerHeight: number,
  floatingHeight: number,
  maxRow: number,
) {
  const headerHeightTotal = useMemo(() => {
    return (maxRow - 1) * headerGroupHeight + headerHeight + floatingHeight;
  }, [floatingHeight, headerGroupHeight, headerHeight, maxRow]);

  return headerHeightTotal;
}
