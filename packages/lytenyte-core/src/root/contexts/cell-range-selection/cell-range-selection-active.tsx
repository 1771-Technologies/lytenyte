import { splitRect, type DataRect, type SectionedRect } from "@1771technologies/lytenyte-shared";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";
import { useCutoffContext } from "../grid-areas/cutoff-context.js";

interface CellRangeSelectionActiveType {
  readonly activeRange: DataRect | null;
  readonly setActiveRange: Dispatch<SetStateAction<DataRect | null>>;
  readonly activeSplit: SectionedRect[];
  readonly deselect: boolean;
  readonly setDeselect: Dispatch<SetStateAction<boolean>>;
  readonly selecting: boolean;
  readonly setSelecting: Dispatch<SetStateAction<boolean>>;
}

const context = createContext<CellRangeSelectionActiveType>({} as any);

export function CellRangeSelectionActive(props: PropsWithChildren) {
  const cutoff = useCutoffContext();

  const [activeRange, setActiveRange] = useState<DataRect | null>(null);
  const [deselect, setDeselect] = useState(false);

  const [selecting, setSelecting] = useState(false);

  const activeSplit = useMemo(() => {
    if (!activeRange) return [];

    return splitRect(
      activeRange,
      cutoff.startCutoff,
      cutoff.endCutoff,
      cutoff.topCutoff,
      cutoff.bottomCutoff,
    );
  }, [activeRange, cutoff.bottomCutoff, cutoff.endCutoff, cutoff.startCutoff, cutoff.topCutoff]);

  const value = useMemo<CellRangeSelectionActiveType>(() => {
    return {
      activeRange,
      activeSplit,
      deselect,
      setDeselect,
      setActiveRange,
      selecting: selecting,
      setSelecting,
    };
  }, [activeRange, activeSplit, deselect, selecting]);

  return <context.Provider value={value}>{props.children}</context.Provider>;
}

export const useCellRangeSelectionActive = () => useContext(context);
