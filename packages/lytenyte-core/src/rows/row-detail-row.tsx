import { SCROLL_WIDTH_VARIABLE_USE, sizeFromCoord } from "@1771technologies/lytenyte-shared";
import type { RowFullWidthRowLayout, RowNode, RowNormalRowLayout } from "../+types";
import { useGridRoot } from "../context.js";
import { useEffect, useState } from "react";

export function RowDetailRow<T>({
  layout,
}: {
  layout: RowNormalRowLayout<T> | RowFullWidthRowLayout<T>;
}) {
  const cx = useGridRoot();
  const row = layout.row.useValue();
  if (!row || !cx.grid.api.rowDetailIsExpanded(row)) return null;

  return <RowDetailImpl row={row} rowIndex={layout.rowIndex} />;
}

function RowDetailImpl<T>({ row, rowIndex }: { row: RowNode<T>; rowIndex: number }) {
  const cx = useGridRoot();
  const rtl = cx.grid.state.rtl.useValue();

  const height = cx.grid.api.rowDetailRenderedHeight(row);
  const rowHeight = sizeFromCoord(rowIndex, cx.grid.state.yPositions.get()) - height;

  const Renderer = cx.grid.state.rowDetailRenderer.useValue().fn;

  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const first = ref?.firstElementChild as HTMLElement;
    if (!first) return;

    const obs = new ResizeObserver(() => {
      cx.grid.internal.rowDetailAutoHeightCache.set((prev) => ({
        ...prev,
        [rowIndex]: first.offsetHeight,
      }));
    });

    obs.observe(first);

    return () => obs.disconnect();
  }, [cx.grid.internal.rowDetailAutoHeightCache, ref?.firstElementChild, rowIndex]);

  const isAuto = cx.grid.state.rowDetailHeight.useValue() === "auto";
  return (
    <div
      ref={setRef}
      role="gridcell"
      style={{
        pointerEvents: "none",
        position: "absolute",
        left: 0,
        width: SCROLL_WIDTH_VARIABLE_USE,
      }}
    >
      <div
        tabIndex={0}
        data-ln-gridid={cx.gridId}
        data-ln-row-detail
        data-ln-rowindex={rowIndex}
        style={{
          position: "sticky",
          pointerEvents: "all",
          right: rtl ? "0px" : undefined,
          left: rtl ? undefined : "0px",
          marginTop: rowHeight,
          width: cx.grid.state.viewportWidthInner.useValue(),
          height: isAuto ? "auto" : height,
        }}
      >
        <Renderer grid={cx.grid} row={row} rowIndex={rowIndex} />
      </div>
    </div>
  );
}
