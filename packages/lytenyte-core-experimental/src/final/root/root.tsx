import { useId, useImperativeHandle, useRef, useState } from "react";
import type { ColumnAbstract } from "../types/column.js";
import type { Props, Props as RawProps } from "../types/props.js";
import type { RowSource } from "../types/row-source.js";
import { useViewportDimensions } from "./hooks/use-viewport-dimensions.js";
import { useControlledGridState } from "./hooks/use-controlled-grid-state.js";
import { useColumnView } from "./hooks/use-column-view.js";
import { DEFAULT_ROW_SOURCE } from "./constants.js";
import { useTotalHeaderHeight } from "./hooks/use-total-header-height.js";
import { useXPositions } from "./hooks/use-x-positions.js";
import { useYPositions } from "./hooks/use-y-positions.js";
import type { API } from "../types/api.js";
import type { RowNode } from "../types/row-node.js";
import { useHeaderLayout } from "./hooks/use-header-layout.js";

export const Root = <
  Data = unknown,
  Source extends RowSource = RowSource,
  Ext extends Record<string, any> = object,
  C extends ColumnAbstract = ColumnAbstract,
>(
  p: Root.Props<Data, Source, Ext, C>,
) => {
  const props = p as unknown as Root.Props;
  const source = props.rowSource ?? DEFAULT_ROW_SOURCE;

  const [vp, setVp] = useState<HTMLDivElement | null>(null);
  const id = useId();

  const dimensions = useViewportDimensions(vp);
  const controlled = useControlledGridState(props);

  const view = useColumnView(props, source, controlled.columnGroupExpansions);
  const totalHeaderHeight = useTotalHeaderHeight(props, view.maxRow);

  const xPositions = useXPositions(props, view, dimensions.innerWidth);
  const yPositions = useYPositions(
    props,
    source,
    dimensions.innerHeight - totalHeaderHeight,
    controlled.detailExpansions,
  );

  const api = useRef<API<RowNode<any>, any>>(null as any);
  useImperativeHandle(props.ref, () => api.current as any, []);

  const headerLayout = useHeaderLayout(view, props);

  return <></>;
};

export namespace Root {
  export type Props<
    Data = unknown,
    Source extends RowSource = RowSource,
    Ext extends Record<string, any> = object,
    C extends ColumnAbstract = ColumnAbstract,
  > = RawProps<Data, Source, Ext, C>;
}
