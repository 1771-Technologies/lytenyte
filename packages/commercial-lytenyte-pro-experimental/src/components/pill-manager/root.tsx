import { forwardRef, Fragment, memo, useMemo, useRef, useState, type JSX, type ReactNode } from "react";
import { PillRootProvider, type PillRootContext } from "./root.context.js";
import type { PillItemSpec, PillRowSpec } from "./types.js";
import { PillRowDefault } from "./row-default.js";

function PillRootImpl(
  {
    children = PillRowDefault,
    rows,
    orientation,
    onPillRowChange,
    onPillItemActiveChange,
    onPillItemThrown,
    ...p
  }: PillManager.Props,
  ref: PillManager.Props["ref"],
) {
  const [cloned, setCloned] = useState<PillRowSpec[] | null>(null);
  const [dragState, setDragState] = useState<{
    readonly activeId: string;
    readonly activeRow: string;
    readonly activeType: string;
  } | null>(null);

  const prevSwapId = useRef<string | null>(null);
  const prevRowId = useRef<string | null>(null);
  const movedRef = useRef<{ id: string; pillId: string } | null>(null);

  const value = useMemo<PillRootContext>(() => {
    return {
      orientation: orientation ?? "horizontal",
      cloned,
      setCloned,
      rows: rows,

      dragState,
      setDragState,

      movedRef,
      prevSwapId,
      prevRowId,

      onPillItemActiveChange: onPillItemActiveChange ?? (() => {}),
      onPillRowChange: onPillRowChange ?? (() => {}),
      onPillItemThrown: onPillItemThrown ?? (() => {}),
    };
  }, [cloned, dragState, onPillItemActiveChange, onPillItemThrown, onPillRowChange, orientation, rows]);

  const rendered = useMemo(() => {
    const r = cloned ?? rows;
    return r.map((x, i) => <Fragment key={i}>{children(x, value)}</Fragment>);
  }, [children, cloned, rows, value]);

  return (
    <PillRootProvider value={value}>
      <div {...p} ref={ref} data-ln-pill-root>
        {rendered}
      </div>
    </PillRootProvider>
  );
}

export const PillManager = memo(forwardRef(PillRootImpl));

export namespace PillManager {
  export type Props = Omit<JSX.IntrinsicElements["div"], "children"> & {
    readonly rows: PillRowSpec[];
    readonly orientation?: "horizontal" | "vertical";
    readonly children?: (row: PillRowSpec, ctx: PillRootContext) => ReactNode;

    readonly onPillRowChange?: (params: {
      readonly changed: PillRowSpec[];
      readonly full: PillRowSpec[];
    }) => void;

    readonly onPillItemActiveChange?: (params: {
      readonly index: number;
      readonly item: PillItemSpec;
      readonly row: PillRowSpec;
    }) => void;

    readonly onPillItemThrown?: (params: {
      readonly index: number;
      readonly item: PillItemSpec;
      readonly row: PillRowSpec;
    }) => void;
  };
}
