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
import { useGridSections } from "./grid-sections-context.js";

interface ActiveRangeContextType {
  readonly activeRange: DataRect | null;
  readonly setActiveRange: Dispatch<SetStateAction<DataRect | null>>;
  readonly activeSplit: SectionedRect[];
  readonly deselect: boolean;
  readonly setDeselect: Dispatch<SetStateAction<boolean>>;
}

const context = createContext<ActiveRangeContextType>({} as any);

export function ActiveRangeProvider(props: PropsWithChildren) {
  const cutoff = useGridSections();
  const [activeRange, setActiveRange] = useState<DataRect | null>(null);
  const [deselect, setDeselect] = useState(false);

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

  const value = useMemo<ActiveRangeContextType>(() => {
    return {
      activeRange,
      activeSplit,
      deselect,
      setDeselect,
      setActiveRange,
    };
  }, [activeRange, activeSplit, deselect]);

  return <context.Provider value={value}>{props.children}</context.Provider>;
}

export const useActiveRangeSelection = () => useContext(context);
