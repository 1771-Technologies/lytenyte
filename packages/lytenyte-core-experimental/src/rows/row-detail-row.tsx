import { SCROLL_WIDTH_VARIABLE_USE, sizeFromCoord } from "@1771technologies/lytenyte-shared";
import type { LayoutFullWidthRow, LayoutRowWithCells } from "../layout";
import { useGridRoot } from "../root/context.js";
import { useRowDetailContext } from "../root/row-detail/row-detail-context.js";
import { useEffect, useState } from "react";
import type { RowNode } from "../types/row";

export function RowDetailRow<T>({ layout }: { layout: LayoutRowWithCells<T> | LayoutFullWidthRow<T> }) {
  const cx = useGridRoot();
  const row = layout.row.useValue();

  const expansions = cx.rowDetailExpansions.useValue();

  if (!row || !expansions.has(row.id)) return null;

  return <RowDetailImpl row={row} rowIndex={layout.rowIndex} />;
}

function RowDetailImpl<T>({ row, rowIndex }: { row: RowNode<T>; rowIndex: number }) {
  const cx = useGridRoot();
  const detailCtx = useRowDetailContext();
  const rtl = cx.rtl;

  const height = detailCtx.getRowDetailHeight(row.id);
  const rowHeight = sizeFromCoord(rowIndex, cx.yPositions) - height;
  const Renderer = detailCtx.rowDetailRenderer;
  const [detailEl, setDetailEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const first = detailEl?.firstElementChild as HTMLElement;
    if (!first) return;

    const obs = new ResizeObserver(() => {
      detailCtx.setAutoHeightCache((prev) => ({
        ...prev,
        [rowIndex]: first.offsetHeight,
      }));
    });

    obs.observe(first);

    return () => obs.disconnect();
  }, [detailCtx, detailEl?.firstElementChild, rowIndex]);

  const isAuto = detailCtx.rowDetailHeight === "auto";

  return (
    <div
      ref={setDetailEl}
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
        data-ln-gridid={cx.id}
        data-ln-row-detail
        data-ln-rowindex={rowIndex}
        style={{
          position: "sticky",
          pointerEvents: "all",
          right: rtl ? "0px" : undefined,
          left: rtl ? undefined : "0px",
          marginTop: rowHeight,
          width: cx.vpInnerWidth,
          height: isAuto ? "auto" : height,
        }}
      >
        {Renderer ? <Renderer row={row} rowIndex={rowIndex} api={cx.api} /> : null}
      </div>
    </div>
  );
}
