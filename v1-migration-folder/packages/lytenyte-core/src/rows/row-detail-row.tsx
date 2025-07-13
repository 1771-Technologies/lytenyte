import {
  getNearestRow,
  getRowIndexFromEl,
  sizeFromCoord,
  VIEWPORT_WIDTH_VARIABLE_USE,
} from "@1771technologies/lytenyte-shared";
import type { RowFullWidthRowLayout, RowNode, RowNormalRowLayout } from "../+types";
import { useGridRoot } from "../context";
import { useEffect, useState } from "react";
import { getTabbables, isHTMLElement } from "@1771technologies/lytenyte-dom-utils";

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
    const parent = ref?.parentElement;
    const first = ref?.firstElementChild as HTMLElement;

    if (!parent || !first) return;

    const controller = new AbortController();

    let focusTime = false;

    const vp = cx.grid.state.viewport.get();
    vp?.addEventListener(
      "keydown",
      () => {
        focusTime = true;
        setTimeout(() => {
          focusTime = false;
        }, 20);
      },
      { capture: true, signal: controller.signal },
    );

    parent.addEventListener(
      "focusin",
      (e) => {
        if (focusTime && e.relatedTarget && isHTMLElement(e.relatedTarget)) {
          const row = getNearestRow(e.relatedTarget);

          const gridId = cx.grid.state.gridId.get();
          if (gridId !== row?.getAttribute("data-ln-gridid")) return;

          const prevIndex = getRowIndexFromEl(row);
          if (prevIndex - 1 === rowIndex) {
            first.focus();
          }
        }
      },
      { signal: controller.signal },
    );

    parent.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "ArrowDown" && document.activeElement !== first) {
          e.stopPropagation();
          e.preventDefault();

          first.focus();
        }
      },
      { signal: controller.signal },
    );

    first.addEventListener(
      "keydown",
      (e) => {
        const next = rtl ? "ArrowLeft" : "ArrowRight";
        const prev = rtl ? "ArrowRight" : "ArrowLeft";

        if (e.key === "Escape") {
          first.focus();
          return;
        }

        if (e.key === "ArrowUp") {
          e.stopPropagation();
          e.preventDefault();

          cx.grid.api.focusCell({
            row: rowIndex,
            column: cx.grid.internal.focusActive.get()?.colIndex ?? 0,
          });
        }

        if (e.key === next) {
          e.preventDefault();
          e.stopPropagation();

          const focusables = getTabbables(first);
          const index = focusables.indexOf(document.activeElement as HTMLElement);
          if (index === -1) focusables.at(0)?.focus();
          else focusables.at(index + 1)?.focus();
        }

        if (e.key === prev) {
          e.preventDefault();
          e.stopPropagation();

          const focusables = getTabbables(first);
          const index = focusables.indexOf(document.activeElement as HTMLElement);
          if (index === -1) focusables.at(-1)?.focus();
          else focusables[index - 1]?.focus();
        }
      },
      { signal: controller.signal },
    );

    return () => {
      controller.abort();
    };
  }, [
    cx.grid.api,
    cx.grid.internal.focusActive,
    cx.grid.internal.focusPrevRowIndex,
    cx.grid.state.gridId,
    cx.grid.state.rtl,
    cx.grid.state.viewport,
    ref,
    rowIndex,
    rtl,
  ]);

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
      style={{
        gridColumnStart: "1",
        gridColumnEnd: "2",
        gridRowStart: "1",
        gridRowEnd: "2",
        marginTop: rowHeight,
        pointerEvents: "all",
      }}
    >
      <div
        tabIndex={-1}
        data-ln-row-detail
        role="gridcell"
        style={{
          position: "sticky",
          right: rtl ? "0px" : undefined,
          left: rtl ? undefined : "0px",
          width: VIEWPORT_WIDTH_VARIABLE_USE,
          height: isAuto ? "auto" : height,
        }}
      >
        <Renderer grid={cx.grid} row={row} rowIndex={rowIndex} />
      </div>
    </div>
  );
}
