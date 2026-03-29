import {
  splitRect,
  type DataRect,
  type SectionedRect,
  type PositionGridCell,
  type PartialMandatory,
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
import { useCutoffContext } from "../grid-areas/cutoff-context.js";
import type { Root } from "../../root.js";
import { useControlled, useEvent, usePiece, type Piece } from "../../../internal.js";

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

const context = createContext<CellSelectionContextType>({} as any);
const contextPiece = createContext<Piece<DataRect[]>>(null as any);
const contextSettings = createContext<CellSelectionSettingsType>({} as any);

type Props = Pick<
  PartialMandatory<Root.Props>,
  | "cellSelectionMode"
  | "cellSelectionExcludeMarker"
  | "cellSelectionMaintainOnNonCellPosition"
  | "cellSelections"
  | "onCellSelectionChange"
>;

function CellSelectionContextBase(p: PropsWithChildren<Props>) {
  const c = useCutoffContext();

  const [cellSelections, setCellSelections] = useControlled<DataRect[]>({
    controlled: p.cellSelections,
    default: [] as DataRect[],
  });
  const onCellSelectionChange = useEvent((change: DataRect[]) => {
    setCellSelections(change);
    p.onCellSelectionChange?.(change);
  });
  const cellSelections$ = usePiece(cellSelections);

  const cellSelectionsSplit = useMemo(() => {
    const splits = cellSelections.flatMap((x) =>
      splitRect(x, c.startCutoff, c.endCutoff, c.topCutoff, c.bottomCutoff),
    );

    return splits;
  }, [cellSelections, c.startCutoff, c.endCutoff, c.topCutoff, c.bottomCutoff]);

  const anchorRef = useRef<PositionGridCell | null>(null);

  const settings = useMemo<CellSelectionSettingsType>(() => {
    return {
      onCellSelectionChange: onCellSelectionChange,
      cellSelectionClearOnSelf: true,
      ignoreFirstColumn: p.cellSelectionExcludeMarker ?? false,
      cellSelectionMaintainOnNonCellPosition: p.cellSelectionMaintainOnNonCellPosition ?? false,
      cellSelectionMode: p.cellSelectionMode ?? "none",
      anchorRef,
    };
  }, [
    onCellSelectionChange,
    p.cellSelectionExcludeMarker,
    p.cellSelectionMaintainOnNonCellPosition,
    p.cellSelectionMode,
  ]);

  const value = useMemo<CellSelectionContextType>(() => {
    return {
      cellSelections: cellSelections,
      cellSelectionsSplit,
    };
  }, [cellSelections, cellSelectionsSplit]);

  return (
    <contextSettings.Provider value={settings}>
      <context.Provider value={value}>
        <contextPiece.Provider value={cellSelections$}>{p.children}</contextPiece.Provider>
      </context.Provider>
    </contextSettings.Provider>
  );
}

export const CellSelectionContext = memo(CellSelectionContextBase);

export const useCellRangeSelection = () => useContext(context);
export const useCellRangeSelectionSettings = () => useContext(contextSettings);
export const useCellRangeSelectionPieceContext = () => useContext(contextPiece);
