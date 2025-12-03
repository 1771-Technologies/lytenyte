import { sizeFromCoord } from "@1771technologies/lytenyte-shared";
import type { LayoutFullWidthRow, LayoutRowWithCells } from "../types/layout";
import { useGridRoot } from "../root/context.js";
import type { RowNode } from "../types/row";

export function RowDetailRow<T>({
  layout,
}: {
  layout: LayoutRowWithCells<T> | LayoutFullWidthRow<T>;
}) {
  const cx = useGridRoot();
  const row = layout.row.useValue();

  const expansions = cx.rowDetailExpansions.useValue();

  if (!row || !expansions.has(row.id)) return null;

  return <RowDetailImpl row={row} rowIndex={layout.rowIndex} />;
}

function RowDetailImpl<T>({ row, rowIndex }: { row: RowNode<T>; rowIndex: number }) {
  const cx = useGridRoot();
  const rtl = cx.rtl;

  // TODO cx.grid.api.rowDetailRenderedHeight(row);
  const height = 0;

  const rowHeight = sizeFromCoord(rowIndex, cx.yPositions) - height;
  void rtl;
  void rowHeight;
  void row;
  return null;

  // const Renderer = cx.grid.state.rowDetailRenderer.useValue().fn;

  // const [ref, setRef] = useState<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   const first = ref?.firstElementChild as HTMLElement;
  //   if (!first) return;

  //   const obs = new ResizeObserver(() => {
  //     cx.grid.internal.rowDetailAutoHeightCache.set((prev) => ({
  //       ...prev,
  //       [rowIndex]: first.offsetHeight,
  //     }));
  //   });

  //   obs.observe(first);

  //   return () => obs.disconnect();
  // }, [cx.grid.internal.rowDetailAutoHeightCache, ref?.firstElementChild, rowIndex]);

  // const isAuto = cx.grid.state.rowDetailHeight.useValue() === "auto";
  // return (
  //   <div
  //     ref={setRef}
  //     role="gridcell"
  //     style={{
  //       pointerEvents: "none",
  //       position: "absolute",
  //       left: 0,
  //       width: SCROLL_WIDTH_VARIABLE_USE,
  //     }}
  //   >
  //     <div
  //       tabIndex={0}
  //       data-ln-gridid={cx.gridId}
  //       data-ln-row-detail
  //       data-ln-rowindex={rowIndex}
  //       style={{
  //         position: "sticky",
  //         pointerEvents: "all",
  //         right: rtl ? "0px" : undefined,
  //         left: rtl ? undefined : "0px",
  //         marginTop: rowHeight,
  //         width: cx.grid.state.viewportWidthInner.useValue(),
  //         height: isAuto ? "auto" : height,
  //       }}
  //     >
  //       <Renderer grid={cx.grid} row={row} rowIndex={rowIndex} />
  //     </div>
  //   </div>
  // );
}
