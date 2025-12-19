import {
  SCROLL_WIDTH_VARIABLE_USE,
  sizeFromCoord,
  type LayoutFullWidthRow,
  type LayoutRowWithCells,
  type RowNode,
} from "@1771technologies/lytenyte-shared";
import { useEffect, useState } from "react";
import { useRoot } from "../../root/root-context.js";

export function RowDetailRow<T>({ layout }: { layout: LayoutRowWithCells<T> | LayoutFullWidthRow<T> }) {
  const { detailExpansions: expansions } = useRoot();
  const row = layout.row.useValue();

  if (!row || !expansions.has(row.id)) return null;

  return <RowDetailImpl row={row} rowIndex={layout.rowIndex} />;
}

function RowDetailImpl<T>({ row, rowIndex }: { row: RowNode<T>; rowIndex: number }) {
  const { id, rtl, dimensions, api, yPositions, rowDetailRenderer, setDetailCache, rowDetailHeight } = useRoot();

  const height = api.rowDetailHeight(row.id);
  const rowHeight = sizeFromCoord(rowIndex, yPositions) - height;

  const Renderer = rowDetailRenderer;
  const [detailEl, setDetailEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const first = detailEl?.firstElementChild as HTMLElement;
    if (!first) return;

    const obs = new ResizeObserver(() => {
      setDetailCache((prev) => ({
        ...prev,
        [rowIndex]: first.offsetHeight,
      }));
    });

    obs.observe(first);

    return () => obs.disconnect();
  }, [detailEl?.firstElementChild, rowIndex, setDetailCache]);

  const isAuto = rowDetailHeight === "auto";

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
        data-ln-gridid={id}
        data-ln-row-detail
        data-ln-rowindex={rowIndex}
        style={{
          position: "sticky",
          pointerEvents: "all",
          right: rtl ? "0px" : undefined,
          left: rtl ? undefined : "0px",
          marginTop: rowHeight,
          width: dimensions.innerWidth,
          height: isAuto ? "auto" : height,
        }}
      >
        {Renderer ? <Renderer row={row} rowIndex={rowIndex} api={api} /> : null}
      </div>
    </div>
  );
}
