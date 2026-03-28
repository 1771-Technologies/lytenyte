import type {
  ColumnAbstract,
  ColumnView,
  PartialMandatory,
  RowSource,
} from "@1771technologies/lytenyte-shared";
import { createContext, memo, useContext, useMemo, type PropsWithChildren } from "react";
import type { Root } from "../../root";
import { useControlled } from "../../../hooks/use-controlled.js";
import { useEvent } from "../../../hooks/use-event.js";
import { useColumnView } from "../../hooks/use-column-view.js";

interface ColumnContext {
  readonly view: ColumnView;
  readonly columnGroupExpansions: Record<string, boolean>;
  readonly onColumnGroupExpansionChange: (change: Record<string, boolean>) => void;
  readonly onColumnsChange: (change: ColumnAbstract[]) => void;
}

const context = createContext(null as unknown as ColumnContext);

const EMPTY: any = {};

type Picks =
  | "columns"
  | "columnGroupExpansions"
  | "rowGroupColumn"
  | "columnMarker"
  | "columnBase"
  | "columnGroupDefaultExpansion"
  | "onColumnsChange"
  | "onColumnGroupExpansionChange";

type Props = Pick<PartialMandatory<Root.Props>, Picks> & { source: RowSource };

function ColumnContextProviderBase({ children, source, ...p }: PropsWithChildren<Props>) {
  const [columnGroupExpansions, setColumnGroupExpansions] = useControlled({
    controlled: p.columnGroupExpansions,
    default: EMPTY as Record<string, boolean>,
  });
  const onColumnGroupExpansionChange = useEvent((change: Record<string, boolean>) => {
    p.onColumnGroupExpansionChange?.(change);
    setColumnGroupExpansions(change);
  });

  const view = useColumnView(p, source, columnGroupExpansions);

  const value = useMemo<ColumnContext>(() => {
    return {
      view,
      columnGroupExpansions,
      onColumnGroupExpansionChange,
      onColumnsChange: p.onColumnsChange ?? (() => {}),
    };
  }, [columnGroupExpansions, onColumnGroupExpansionChange, p.onColumnsChange, view]);

  return <context.Provider value={value}>{children}</context.Provider>;
}

export const ColumnContextProvider = memo(ColumnContextProviderBase);
export const useColumnsContext = () => useContext(context);
