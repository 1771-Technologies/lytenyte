import type { PartialMandatory } from "@1771technologies/lytenyte-shared";
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
import type { Root } from "../root";
import { useEvent } from "../../hooks/use-event.js";
import { useControlled } from "../../hooks/use-controlled.js";

const context = createContext<{
  readonly detailExpansions: Set<string>;
  readonly onRowDetailExpansionsChange: (change: Set<string>) => void;

  readonly detailCache: Record<string, number>;
  readonly setDetailCache: Dispatch<SetStateAction<Record<string, number>>>;

  readonly isAuto: boolean;
}>(null as any);

const contextDetailHeight = createContext<(id: string) => number>(null as any);

type Props = Pick<
  PartialMandatory<Root.Props>,
  "rowDetailExpansions" | "onRowDetailExpansionsChange" | "rowDetailAutoHeightGuess" | "rowDetailHeight"
>;

const EMPTY_SET = new Set();
export const RowDetailProvider = memo(({ children, ...props }: PropsWithChildren<Props>) => {
  const [detailCache, setDetailCache] = useState<Record<string, number>>({});

  const [detailExpansions, setDetailExpansions] = useControlled<Set<string>>({
    controlled: props.rowDetailExpansions,
    default: EMPTY_SET as Set<string>,
  });

  const onRowDetailExpansionsChange = useEvent((change: Set<string>) => {
    props.onRowDetailExpansionsChange?.(change);
    setDetailExpansions(change);
  });

  const isAuto = props.rowDetailHeight === "auto";
  const value = useMemo(() => {
    return { detailExpansions, onRowDetailExpansionsChange, detailCache, setDetailCache, isAuto };
  }, [detailCache, detailExpansions, isAuto, onRowDetailExpansionsChange]);

  const detailHeightFn = useMemo(() => {
    // If there are no detail expansions, we can just return 0.
    if (detailExpansions.size === 0) return () => 0;

    if (props.rowDetailHeight === "auto") {
      const guess = props.rowDetailAutoHeightGuess ?? 200;
      return (id: string) => (detailExpansions.has(id) ? (detailCache[id] ?? guess) : 0);
    }

    const height = props.rowDetailHeight ?? 200;
    return (id: string) => (detailExpansions.has(id) ? height : 0);
  }, [detailCache, detailExpansions, props.rowDetailAutoHeightGuess, props.rowDetailHeight]);

  return (
    <context.Provider value={value}>
      <contextDetailHeight.Provider value={detailHeightFn}>{children}</contextDetailHeight.Provider>
    </context.Provider>
  );
});

export const useRowDetailContext = () => useContext(context);
export const useRowDetailHeightFn = () => useContext(contextDetailHeight);
