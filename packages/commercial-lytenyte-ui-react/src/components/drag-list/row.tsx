import { forwardRef, useMemo, type JSX, type ReactNode } from "react";
import { useDragList } from "./context.js";
import { DragWrapped } from "./drop-wrapper.js";
import { FallbackRenderer } from "./fallback-renderer.js";

const DragListRowBase = (
  { children, ...props }: DragListRow.Props,
  ref: DragListRow.Props["ref"],
) => {
  const { items, orientation } = useDragList();
  const nodes = useMemo(() => {
    const renderer = (children ?? FallbackRenderer) as any;
    return items.map((x) => {
      return <DragWrapped key={x.id}>{renderer(x as any)}</DragWrapped>;
    });
  }, [children, items]);

  return (
    <div {...props} ref={ref} data-ln-dlist-row data-ln-dlist-orientation={orientation}>
      {nodes}
    </div>
  );
};

export const DragListRow = forwardRef(DragListRowBase);

export namespace DragListRow {
  export type Props = Omit<JSX.IntrinsicElements["div"], "children"> & {
    readonly children?: <T extends { id: string }>(item: T) => ReactNode;
  };
}
