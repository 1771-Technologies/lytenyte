import {
  SCROLL_WIDTH_VARIABLE_USE,
  sizeFromCoord,
  type LayoutFullWidthRow,
  type LayoutRowWithCells,
  type RowNode,
} from "@1771technologies/lytenyte-shared";
import { useEffect, useState } from "react";
import { useGridIdContext } from "../../root/contexts/grid-id.js";
import { useYCoordinates } from "../../root/contexts/coordinates.js";
import { useAPI } from "../../root/contexts/api-provider.js";
import { useRowDetailContext, useRowDetailHeightFn } from "../../root/contexts/row-detail.js";
import { useGridRenderer } from "../../root/contexts/grid-renderer-context.js";
import { useRowSourceContext } from "../../root/contexts/row-source-provider.js";
import { useDimensionContext } from "../../root/contexts/viewport/dimensions-context.js";
import { useStyleContext } from "../../root/contexts/styles-context.js";

export function RowDetailRow({ layout }: { layout: LayoutRowWithCells | LayoutFullWidthRow }) {
  const source = useRowSourceContext();
  const row = source.rowByIndex(layout.rowIndex).useValue();

  const { detailExpansions } = useRowDetailContext();
  if (!row || !detailExpansions.has(row.id)) return null;

  return <RowDetailImpl row={row} rowIndex={layout.rowIndex} />;
}

function RowDetailImpl<T>({ row, rowIndex }: { row: RowNode<T>; rowIndex: number }) {
  const id = useGridIdContext();
  const api = useAPI();

  const styles = useStyleContext();

  const dimensions = useDimensionContext();

  const yPositions = useYCoordinates();

  const { isAuto, setDetailCache } = useRowDetailContext();
  const detailHeightFn = useRowDetailHeightFn();

  const height = detailHeightFn(row.id);
  const rowHeight = sizeFromCoord(rowIndex, yPositions) - height;
  const { DetailRenderer } = useGridRenderer();

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
          insetInlineStart: "0px",
          marginTop: rowHeight,
          width: dimensions.innerWidth,
          height: isAuto ? "auto" : height,
        }}
      >
        <DetailRenderer row={row} rowIndex={rowIndex} api={api} />
      </div>
    </div>
  );
}
