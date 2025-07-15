import { forwardRef, type JSX } from "react";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import type { RowFullWidthRowLayout } from "../+types";
import { useGridRoot } from "../context";
import { RowFullWidthReact } from "@1771technologies/lytenyte-shared";
import { RowDetailRow } from "./row-detail-row";
import { useRowContextValue } from "./row/use-row-context-value";

export interface RowFullWidthProps {
  readonly row: RowFullWidthRowLayout<any>;
  readonly space?: "viewport" | "scroll-width";
}

const RowFullWidthImpl = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & RowFullWidthProps
>(function RowFullWidth({ row: layout, space, children, ...props }, forwarded) {
  const grid = useGridRoot().grid;
  const Renderer = grid.state.rowFullWidthRenderer.useValue().fn;
  const row = layout.row.useValue();

  const meta = useRowContextValue(grid, layout.row);

  return (
    <RowFullWidthReact
      {...props}
      ref={forwarded}
      detail={<RowDetailRow layout={layout} />}
      detailHeight={grid.api.rowDetailRenderedHeight(row ?? "")}
      gridId={grid.state.gridId.useValue()}
      rtl={grid.state.rtl.useValue()}
      rowFirstPinBottom={layout.rowFirstPinBottom}
      rowLastPinTop={layout.rowLastPinTop}
      rowIndex={layout.rowIndex}
      rowIsFocusRow={layout.rowIsFocusRow ?? false}
      yPositions={grid.state.yPositions.useValue()}
      space={space}
      data-ln-row-selected={meta.selected}
    >
      {children ??
        (row ? (
          <Renderer
            grid={grid}
            row={row}
            rowIndex={layout.rowIndex}
            rowSelected={meta.selected}
            rowIndeterminate={meta.indeterminate}
          />
        ) : null)}
    </RowFullWidthReact>
  );
});

export const RowFullWidth = fastDeepMemo(RowFullWidthImpl);
