import { createContext, memo, useContext, useMemo, type PropsWithChildren, type ReactNode } from "react";
import type { Root } from "../root.js";
import type { PartialMandatory } from "@1771technologies/lytenyte-shared";
import type { ViewportShadowsProps } from "../../components/viewport/viewport-shadows.js";
import type { Grid } from "../../index.js";

interface GridRendererContext {
  readonly FullWidthRenderer: (props: Grid.T.RowFullWidthRendererParams) => ReactNode;
  readonly DetailRenderer: (props: Grid.T.RowParams) => ReactNode;
  readonly ColumnGroupRenderer: Required<Root.Props>["columnGroupRenderer"];

  readonly Shadows?: (props: ViewportShadowsProps) => ReactNode;
  readonly ViewportOverlay?: ((props: { api: Root.API }) => ReactNode) | ReactNode;
  readonly RowsOverlay?: ((props: { api: Root.API }) => ReactNode) | ReactNode;
}

const context = createContext(null as unknown as GridRendererContext);

type Props = Pick<
  PartialMandatory<Root.Props>,
  | "rowDetailRenderer"
  | "rowFullWidthRenderer"
  | "columnGroupRenderer"
  | "slotRowsOverlay"
  | "slotShadows"
  | "slotViewportOverlay"
>;

const NOOP = () => null;

export const GridRendererContext = memo((props: PropsWithChildren<Props>) => {
  const value = useMemo(() => {
    return {
      FullWidthRenderer: props.rowFullWidthRenderer ?? NOOP,
      DetailRenderer: props.rowDetailRenderer ?? NOOP,
      ColumnGroupRenderer: props.columnGroupRenderer ?? HeaderGroupDefault,

      Shadows: props.slotShadows,
      RowsOverlay: props.slotRowsOverlay,
      ViewportOverlay: props.slotViewportOverlay,
    } satisfies GridRendererContext;
  }, [
    props.columnGroupRenderer,
    props.rowDetailRenderer,
    props.rowFullWidthRenderer,
    props.slotRowsOverlay,
    props.slotShadows,
    props.slotViewportOverlay,
  ]);

  return <context.Provider value={value}>{props.children}</context.Provider>;
});

export const useGridRenderer = () => useContext(context);

function HeaderGroupDefault({ groupPath }: Grid.T.HeaderGroupParams<any>) {
  return <>{groupPath.at(-1)}</>;
}
