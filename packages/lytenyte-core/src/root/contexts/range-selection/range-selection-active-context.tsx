import { splitRect, type DataRect, type SectionedRect } from "@1771technologies/lytenyte-shared";
import {
  createContext,
  memo,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";

interface RangeSelectionActiveContextType {
  readonly activeRange: DataRect | null;
  readonly setActiveRange: Dispatch<SetStateAction<DataRect | null>>;
  readonly activeSplit: SectionedRect[];
  readonly deselect: boolean;
  readonly setDeselect: Dispatch<SetStateAction<boolean>>;
  readonly selecting: boolean;
  readonly setSelecting: Dispatch<SetStateAction<boolean>>;
}
const context = createContext<RangeSelectionActiveContextType>({} as any);

const RangeSelectionActiveProviderImpl = (
  props: PropsWithChildren<{
    topCutoff: number;
    bottomCutoff: number;
    startCutoff: number;
    endCutoff: number;
  }>,
) => {
  const [activeRange, setActiveRange] = useState<DataRect | null>(null);
  const [deselect, setDeselect] = useState(false);
  const [selecting, setSelecting] = useState(false);

  const activeSplit = useMemo(() => {
    if (!activeRange) return [];

    return splitRect(activeRange, props.startCutoff, props.endCutoff, props.topCutoff, props.bottomCutoff);
  }, [activeRange, props.bottomCutoff, props.endCutoff, props.startCutoff, props.topCutoff]);

  const value = useMemo<RangeSelectionActiveContextType>(() => {
    return {
      activeRange,
      setActiveRange,
      activeSplit,

      deselect,
      setDeselect,

      selecting,
      setSelecting,
    };
  }, [activeRange, activeSplit, deselect, selecting]);

  return <context.Provider value={value}>{props.children}</context.Provider>;
};

export const RangeSelectionActiveProvider = memo(RangeSelectionActiveProviderImpl);
export const useRangeActiveSelection = () => useContext(context);
