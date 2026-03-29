import { createContext, memo, useContext, useMemo, type PropsWithChildren, type ReactNode } from "react";
import type { HeaderGroupParams, RowFullWidthRendererParams, RowParams } from "../../types";
import type { Root } from "../root";
import type { PartialMandatory } from "@1771technologies/lytenyte-shared";

interface GridRendererContext {
  readonly FullWidthRenderer: (props: RowFullWidthRendererParams) => ReactNode;
  readonly DetailRenderer: (props: RowParams) => ReactNode;
  readonly ColumnGroupRenderer: Required<Root.Props>["columnGroupRenderer"];
}

const context = createContext(null as unknown as GridRendererContext);

type Props = Pick<
  PartialMandatory<Root.Props>,
  "rowDetailRenderer" | "rowFullWidthRenderer" | "columnGroupRenderer"
>;

const NOOP = () => null;

export const GridRendererContext = memo((props: PropsWithChildren<Props>) => {
  const value = useMemo(() => {
    return {
      FullWidthRenderer: props.rowFullWidthRenderer ?? NOOP,
      DetailRenderer: props.rowDetailRenderer ?? NOOP,
      ColumnGroupRenderer: props.columnGroupRenderer ?? HeaderGroupDefault,
    } satisfies GridRendererContext;
  }, [props.columnGroupRenderer, props.rowDetailRenderer, props.rowFullWidthRenderer]);

  return <context.Provider value={value}>{props.children}</context.Provider>;
});

export const useGridRenderer = () => useContext(context);

function HeaderGroupDefault({ groupPath }: HeaderGroupParams<any>) {
  return <>{groupPath.at(-1)}</>;
}
