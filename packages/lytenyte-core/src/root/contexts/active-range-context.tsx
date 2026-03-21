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
import { useCutoffs } from "./cutoff-context.js";

interface ActiveRangeContextType {
  readonly activeRange: DataRect | null;
  readonly setActiveRange: Dispatch<SetStateAction<DataRect | null>>;
  readonly activeSplit: SectionedRect[];
  readonly deselect: boolean;
}

const context = createContext<ActiveRangeContextType>({} as any);

export function ActiveRangeProvider(props: PropsWithChildren) {
  const cutoff = useCutoffs();
  const [activeRange, setActiveRange] = useState<DataRect | null>(null);

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
      deselect: false,
      setActiveRange,
    };
  }, [activeRange, activeSplit]);

  return <context.Provider value={value}>{props.children}</context.Provider>;
}

export const useActiveRangeSelection = () => useContext(context);
