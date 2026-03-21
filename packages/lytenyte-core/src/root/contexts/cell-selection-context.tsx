import { splitRect, type DataRect, type SectionedRect } from "@1771technologies/lytenyte-shared";
import { createContext, memo, useContext, useMemo, type PropsWithChildren } from "react";
import type { Props } from "../../types";
import { useControlled, useEvent } from "../../internal.js";

interface CellSelectionSettingsType {
  readonly cellSelectionMode: "range" | "multi-range" | "none";
  readonly cellSelectionMaintainOnNonCellPosition: boolean;
  readonly onCellSelectionChange: (change: DataRect[]) => void;
  readonly ignoreFirstColumn: boolean;
}

interface CellSelectionContextType {
  readonly cellSelections: DataRect[];
  readonly cellSelectionsSplit: SectionedRect[];
}

interface RectCutoffs {
  readonly topCutoff: number;
  readonly bottomCutoff: number;
  readonly startCutoff: number;
  readonly endCutoff: number;
}

const context = createContext<CellSelectionContextType>({} as any);
const contextSettings = createContext<CellSelectionSettingsType>({} as any);

function CellSelectionContextBase(
  p: PropsWithChildren<
    Pick<
      Props,
      | "cellSelections"
      | "cellSelectionMode"
      | "cellSelectionExcludeMarker"
      | "cellSelectionMaintainOnNonCellPosition"
      | "onCellSelectionChange"
      | "columnMarker"
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

  const markerOn = p.columnMarker?.on ?? false;
  const settings = useMemo<CellSelectionSettingsType>(() => {
    return {
      onCellSelectionChange,
      ignoreFirstColumn: markerOn && (p.cellSelectionExcludeMarker ?? false),
      cellSelectionMaintainOnNonCellPosition: p.cellSelectionMaintainOnNonCellPosition ?? false,
      cellSelectionMode: p.cellSelectionMode ?? "none",
    };
  }, [
    markerOn,
    onCellSelectionChange,
    p.cellSelectionExcludeMarker,
    p.cellSelectionMaintainOnNonCellPosition,
    p.cellSelectionMode,
  ]);

  const value = useMemo<CellSelectionContextType>(() => {
    return {
      cellSelections,
      cellSelectionsSplit,
    };
  }, [cellSelections, cellSelectionsSplit]);

  return (
    <contextSettings.Provider value={settings}>
      <context.Provider value={value}>{p.children}</context.Provider>;
    </contextSettings.Provider>
  );
}

export const CellSelectionContext = memo(CellSelectionContextBase);

export const useCellSelection = () => useContext(context);
export const useCellSelectionSettings = () => useContext(contextSettings);
