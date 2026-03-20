import { splitRect, type DataRect, type SectionedRect } from "@1771technologies/lytenyte-shared";
import { createContext, memo, useContext, useMemo, type PropsWithChildren } from "react";
import type { Props } from "../../types";
import { useControlled, useEvent } from "../../internal.js";

export interface CellSelectionContextType {
  readonly cellSelectionMode: "range" | "multi-range" | "none";
  readonly cellSelections: DataRect[];
  readonly cellSelectionExcludeMarker: boolean;
  readonly cellSelectionMaintainOnNonCellPosition: boolean;
  readonly onCellSelectionChange: (change: DataRect[]) => void;

  readonly cellSelectionsSplit: SectionedRect[];
}

interface RectCutoffs {
  readonly topCutoff: number;
  readonly bottomCutoff: number;
  readonly startCutoff: number;
  readonly endCutoff: number;
}

const context = createContext<CellSelectionContextType>({} as any);

function CellSelectionContextBase(
  p: PropsWithChildren<
    Pick<
      Props,
      | "cellSelections"
      | "cellSelectionMode"
      | "cellSelectionExcludeMarker"
      | "cellSelectionMaintainOnNonCellPosition"
      | "onCellSelectionChange"
    >
  > &
    RectCutoffs,
) {
  const [cellSelections, setCellSelections] = useControlled({ controlled: p.cellSelections, default: [] });
  const cellSelectionsSplit = useMemo(() => {
    const splits = cellSelections.flatMap((x) =>
      splitRect(x, p.startCutoff, p.endCutoff, p.topCutoff, p.bottomCutoff),
    );

    return splits;
  }, [cellSelections, p.bottomCutoff, p.endCutoff, p.startCutoff, p.topCutoff]);

  const onCellSelectionChange = useEvent((change: DataRect[]) => {
    setCellSelections(change);
    p.onCellSelectionChange?.(change);
  });

  const value = useMemo<CellSelectionContextType>(() => {
    return {
      cellSelections,
      onCellSelectionChange,
      cellSelectionsSplit,
      cellSelectionExcludeMarker: p.cellSelectionExcludeMarker ?? false,
      cellSelectionMaintainOnNonCellPosition: p.cellSelectionMaintainOnNonCellPosition ?? false,
      cellSelectionMode: p.cellSelectionMode ?? "none",
    };
  }, [
    cellSelections,
    cellSelectionsSplit,
    onCellSelectionChange,
    p.cellSelectionExcludeMarker,
    p.cellSelectionMaintainOnNonCellPosition,
    p.cellSelectionMode,
  ]);

  return <context.Provider value={value}>{p.children}</context.Provider>;
}

export const CellSelectionContext = memo(CellSelectionContextBase);
export const useCellSelection = () => useContext(context);
