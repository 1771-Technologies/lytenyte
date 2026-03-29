import { createContext, memo, useContext, useMemo, type PropsWithChildren, type ReactNode } from "react";
import type { RowFullWidthRendererParams, RowParams } from "../../types";
import type { Root } from "../root";
import type { PartialMandatory } from "@1771technologies/lytenyte-shared";

interface GridRendererContext {
  readonly FullWidthRenderer: (props: RowFullWidthRendererParams) => ReactNode | null;
  readonly DetailRenderer: (props: RowParams) => ReactNode | null;
}

const context = createContext(null as unknown as GridRendererContext);

type Props = Pick<PartialMandatory<Root.Props>, "rowDetailRenderer" | "rowFullWidthRenderer">;

const NOOP = () => null;

export const GridRendererContext = memo((props: PropsWithChildren<Props>) => {
  const value = useMemo(() => {
    return {
      FullWidthRenderer: props.rowFullWidthRenderer ?? NOOP,
      DetailRenderer: props.rowDetailRenderer ?? NOOP,
    } satisfies GridRendererContext;
  }, [props.rowDetailRenderer, props.rowFullWidthRenderer]);

  return <context.Provider value={value}>{props.children}</context.Provider>;
});

export const useGridRenderer = () => useContext(context);
