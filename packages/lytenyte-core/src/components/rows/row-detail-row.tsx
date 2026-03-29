import {
  SCROLL_WIDTH_VARIABLE_USE,
  sizeFromCoord,
  type LayoutFullWidthRow,
  type LayoutRowWithCells,
  type RowNode,
} from "@1771technologies/lytenyte-shared";
import { useEffect, useState } from "react";
import { useRoot } from "../../root/root-context.js";
import { useGridIdContext } from "../../root/contexts/grid-id.js";
import { useYCoordinates } from "../../root/contexts/coordinates.js";
import { useAPI } from "../../root/contexts/api-provider.js";
import { useRowDetailContext, useRowDetailHeightFn } from "../../root/contexts/row-detail.js";

export function RowDetailRow({ layout }: { layout: LayoutRowWithCells | LayoutFullWidthRow }) {
  const { source } = useRoot();
  const row = source.rowByIndex(layout.rowIndex).useValue();

  const { detailExpansions } = useRowDetailContext();
  if (!row || !detailExpansions.has(row.id)) return null;

  return <RowDetailImpl row={row} rowIndex={layout.rowIndex} />;
}

function RowDetailImpl<T>({ row, rowIndex }: { row: RowNode<T>; rowIndex: number }) {
  const id = useGridIdContext();
  const api = useAPI();

  const { rtl, dimensions, rowDetailRenderer, styles } = useRoot();

  const yPositions = useYCoordinates();

  const { isAuto, setDetailCache } = useRowDetailContext();
  const detailHeightFn = useRowDetailHeightFn();

  const height = detailHeightFn(row.id);

  const rowHeight = sizeFromCoord(rowIndex, yPositions) - height;

  const Renderer = rowDetailRenderer;
  const [detailEl, setDetailEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const first = detailEl?.firstElementChild as HTMLElement;
    if (!first || !isAuto) return;

    const obs = new ResizeObserver(() => {
      setDetailCache((prev) => ({
        ...prev,
        [row.id]: first.offsetHeight,
      }));
    });

    obs.observe(first);

    return () => obs.disconnect();
  }, [detailEl?.firstElementChild, isAuto, row.id, setDetailCache]);

  return (
    <div
      className={styles?.detail?.className}
      ref={setDetailEl}
      role="gridcell"
      style={{
        pointerEvents: "none",
        position: "absolute",
        left: 0,
        width: SCROLL_WIDTH_VARIABLE_USE,
        ...styles?.detail?.style,
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
