import { useMemo, useState } from "react";
import { AnySet } from "../../constants.js";
import { useControlled } from "../../hooks/use-controlled.js";
import { useEvent } from "../../hooks/use-event.js";
import type { RowDetailRenderer, RowNode } from "../../types/row.js";
import type { RowDetailContext } from "./row-detail-context.js";

export function useRowDetail<T>(
  rowDetailExpansions: Set<string> | undefined,
  onRowDetailExpansionsChange: undefined | ((change: Set<string>) => void),
  rowDetailHeight: number | "auto",
  rowDetailAutoHeightGuess: number,
  rowDetailRenderer: RowDetailRenderer<T> | null,
) {
  const [detailExpansions, setDetailExpansions] = useControlled({
    controlled: rowDetailExpansions,
    default: AnySet,
  });
  const expansionChange = useEvent((change: Set<string>) => {
    onRowDetailExpansionsChange?.(change);
    setDetailExpansions(change);
  });

  const [detailHeightCache, setDetailHeightCache] = useState<Record<string, number>>({});
  const getDetailHeight = useEvent((rowOrId: RowNode<T> | string) => {
    const id = typeof rowOrId === "string" ? rowOrId : rowOrId.id;

    if (!detailExpansions.has(id)) return 0;
    if (rowDetailHeight === "auto") return detailHeightCache[id] ?? rowDetailAutoHeightGuess;
    return rowDetailHeight;
  });
  const detailHeightContext = useMemo<RowDetailContext>(
    () => ({
      rowDetailHeight,
      autoHeightCache: detailHeightCache,
      setAutoHeightCache: setDetailHeightCache,
      getRowDetailHeight: getDetailHeight,
      rowDetailRenderer: rowDetailRenderer,

      detailExpansions,
      onRowDetailExpansionsChange: expansionChange,
    }),
    [
      detailExpansions,
      detailHeightCache,
      expansionChange,
      getDetailHeight,
      rowDetailHeight,
      rowDetailRenderer,
    ],
  );

  return detailHeightContext;
}
