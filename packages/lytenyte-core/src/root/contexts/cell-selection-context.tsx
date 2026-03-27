import {
  splitRect,
  type DataRect,
  type SectionedRect,
  type PositionGridCell,
} from "@1771technologies/lytenyte-shared";
import {
  createContext,
  memo,
  useContext,
  useMemo,
  useRef,
  type PropsWithChildren,
  type RefObject,
} from "react";
import type { Props } from "../../types";

interface CellSelectionSettingsType {
  readonly cellSelectionMode: "range" | "multi-range" | "none";
  readonly cellSelectionMaintainOnNonCellPosition: boolean;
  readonly cellSelectionClearOnSelf: boolean;
  readonly onCellSelectionChange: (change: DataRect[]) => void;
  readonly ignoreFirstColumn: boolean;
  readonly anchorRef: RefObject<PositionGridCell | null>;
}

interface CellSelectionContextType {
  readonly cellSelections: DataRect[];
  readonly cellSelectionsSplit: SectionedRect[];
}

interface CellSelectionContextArgs {
  readonly topCutoff: number;
  readonly bottomCutoff: number;
  readonly startCutoff: number;
  readonly endCutoff: number;
  readonly cellSelections: DataRect[];
  readonly onCellSelectionChange: (change: DataRect[]) => void;
}

const context = createContext<CellSelectionContextType>({} as any);
const contextSettings = createContext<CellSelectionSettingsType>({} as any);

function CellSelectionContextBase(
  p: PropsWithChildren<
    Pick<Props, "cellSelectionMode" | "cellSelectionExcludeMarker" | "cellSelectionMaintainOnNonCellPosition">
  > &
    CellSelectionContextArgs,
) {
  const cellSelectionsSplit = useMemo(() => {
    const splits = p.cellSelections.flatMap((x) =>
      splitRect(x, p.startCutoff, p.endCutoff, p.topCutoff, p.bottomCutoff),
    );

    return splits;
  }, [p.cellSelections, p.bottomCutoff, p.endCutoff, p.startCutoff, p.topCutoff]);

  const anchorRef = useRef<PositionGridCell | null>(null);

  const settings = useMemo<CellSelectionSettingsType>(() => {
    return {
      onCellSelectionChange: p.onCellSelectionChange,
      cellSelectionClearOnSelf: true,
      ignoreFirstColumn: p.cellSelectionExcludeMarker ?? false,
      cellSelectionMaintainOnNonCellPosition: p.cellSelectionMaintainOnNonCellPosition ?? false,
      cellSelectionMode: p.cellSelectionMode ?? "none",
      anchorRef,
    };
  }, [
    p.cellSelectionExcludeMarker,
    p.cellSelectionMaintainOnNonCellPosition,
    p.cellSelectionMode,
    p.onCellSelectionChange,
  ]);

  const value = useMemo<CellSelectionContextType>(() => {
    return {
      cellSelections: p.cellSelections,
      cellSelectionsSplit,
    };
  }, [cellSelectionsSplit, p.cellSelections]);

  return (
    <contextSettings.Provider value={settings}>
      <context.Provider value={value}>{p.children}</context.Provider>
    </contextSettings.Provider>
  );
}

export const CellSelectionContext = memo(CellSelectionContextBase);

export const useCellSelection = () => useContext(context);
export const useCellSelectionSettings = () => useContext(contextSettings);
