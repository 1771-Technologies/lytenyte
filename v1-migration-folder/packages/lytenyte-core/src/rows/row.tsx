import { forwardRef, useMemo, type JSX } from "react";
import { selectAtom } from "@1771technologies/atom/vanilla/utils";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import type { RowNormalRowLayout } from "../+types";
import { useGridRoot } from "../context";
import { RowDetailRow } from "./row-detail-row";
import { RowReact } from "@1771technologies/lytenyte-shared";
import { useAtomValue } from "@1771technologies/atom";

export interface RowProps {
  readonly row: RowNormalRowLayout<any>;
}

const RowImpl = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & RowProps>(function Rows(
  { row, ...props },
  forwarded,
) {
  const ctx = useGridRoot().grid;

  const r = row.row.useValue();

  const rowSelectAtom = useMemo(() => {
    return selectAtom(ctx.internal.rowSelectedIds, (d) => {
      if (!r) return false;
      return d.has(r.id);
    });
  }, [ctx.internal.rowSelectedIds, r]);

  const selected = useAtomValue(rowSelectAtom, { store: ctx.internal.store });

  return (
    <RowReact
      {...props}
      ref={forwarded}
      gridId={ctx.state.gridId.useValue()}
      rowIndex={row.rowIndex}
      rowFirstPinBottom={row.rowFirstPinBottom}
      rowLastPinTop={row.rowLastPinTop}
      rowIsFocusRow={row.rowIsFocusRow ?? false}
      yPositions={ctx.state.yPositions.useValue()}
      data-ln-row-selected={selected}
    >
      {props.children}
      <RowDetailRow layout={row} />
    </RowReact>
  );
});

export const Row = fastDeepMemo(RowImpl);
