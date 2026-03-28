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
import type { Root } from "../../root";
import { useEvent } from "../../../hooks/use-event.js";
import { useControlled } from "../../../hooks/use-controlled.js";

const context = createContext<{
  readonly detailExpansions: Set<string>;
  readonly onRowDetailExpansionsChange: (change: Set<string>) => void;

  readonly detailCache: Record<string, number>;
  readonly setDetailCache: Dispatch<SetStateAction<Record<string, number>>>;
}>(null as any);

type Props = Pick<PartialMandatory<Root.Props>, "rowDetailExpansions" | "onRowDetailExpansionsChange">;

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

  const value = useMemo(() => {
    return { detailExpansions, onRowDetailExpansionsChange, detailCache, setDetailCache };
  }, [detailCache, detailExpansions, onRowDetailExpansionsChange]);

  return <context.Provider value={value}>{children}</context.Provider>;
});

export const useRowDetailContext = () => useContext(context);
