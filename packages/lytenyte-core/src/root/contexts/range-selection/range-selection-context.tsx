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

interface RangeSelectionSettingsType {
  readonly cellSelectionMode: "range" | "multi-range" | "none";
  readonly cellSelectionMaintainOnNonCellPosition: boolean;
  readonly cellSelectionClearOnSelf: boolean;
  readonly onCellSelectionChange: (change: DataRect[]) => void;
  readonly ignoreFirstColumn: boolean;
  readonly anchorRef: RefObject<PositionGridCell | null>;
}

interface RangeSelectionContextType {
  readonly cellSelections: DataRect[];
  readonly cellSelectionsSplit: SectionedRect[];
}

interface RangeSelectionProviderProps {
  readonly topCutoff: number;
  readonly bottomCutoff: number;
  readonly startCutoff: number;
  readonly endCutoff: number;

  readonly cellSelections: DataRect[];
  readonly onCellSelectionChange: (change: DataRect[]) => void;

  readonly mode: "multi-range" | "range" | "none";
  readonly excludeMarker: boolean;
  readonly maintainOnNonCell: boolean;
}

const context = createContext<RangeSelectionContextType>({} as any);
const contextSettings = createContext<RangeSelectionSettingsType>({} as any);

function RangeSelectionContextBase(p: PropsWithChildren<RangeSelectionProviderProps>) {
  const cellSelectionsSplit = useMemo(() => {
    const splits = p.cellSelections.flatMap((x) =>
      splitRect(x, p.startCutoff, p.endCutoff, p.topCutoff, p.bottomCutoff),
    );

    return splits;
  }, [p.cellSelections, p.bottomCutoff, p.endCutoff, p.startCutoff, p.topCutoff]);

  const anchorRef = useRef<PositionGridCell | null>(null);

  const settings = useMemo<RangeSelectionSettingsType>(() => {
    return {
      onCellSelectionChange: p.onCellSelectionChange,
      cellSelectionClearOnSelf: true,
      ignoreFirstColumn: p.excludeMarker,
      cellSelectionMaintainOnNonCellPosition: p.maintainOnNonCell,
      cellSelectionMode: p.mode,
      anchorRef,
    };
  }, [p.excludeMarker, p.maintainOnNonCell, p.mode, p.onCellSelectionChange]);

  const value = useMemo<RangeSelectionContextType>(() => {
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

export const RangeSelectionProvider = memo(RangeSelectionContextBase);

export const useRangeSelection = () => useContext(context);
export const useRangeSelectionSettings = () => useContext(contextSettings);
