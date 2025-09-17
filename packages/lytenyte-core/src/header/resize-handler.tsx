import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import type { HeaderCellLayout } from "../+types";
import { type CSSProperties, type JSX } from "react";
import {
  DEFAULT_COLUMN_WIDTH_MAX,
  DEFAULT_COLUMN_WIDTH_MIN,
  sizeFromCoord,
} from "@1771technologies/lytenyte-shared";
import { useGridRoot } from "../context.js";
import { getComputedStyle } from "@1771technologies/lytenyte-dom-utils";
import { clamp, getClientX } from "@1771technologies/lytenyte-js-utils";

interface ResizeHandlerProps<T> {
  readonly as?: SlotComponent;
  readonly cell: HeaderCellLayout<T>;
  readonly xPositions: Uint32Array;
  readonly className?: string;
  readonly style?: CSSProperties;
}

export function ResizeHandler<T>({
  as,
  cell,
  xPositions,
  style,
  className,
}: ResizeHandlerProps<T>) {
  const width = sizeFromCoord(cell.colStart, xPositions, cell.colSpan);
  const sx = useGridRoot().grid;

  const double = sx.state.columnDoubleClickToAutosize.useValue();

  const defaultProps: JSX.IntrinsicElements["div"] & { "data-ln-header-resizer": "true" } = {
    role: "button",
    "data-ln-header-resizer": "true",
    "aria-label": `Resize ${cell.column.name ?? cell.column.id}`,
    tabIndex: -1,
    onDoubleClick: () => {
      if (!double) return;

      sx.api.columnAutosize({
        columns: [cell.column],
        includeHeader: true,
      });
    },
    onPointerDown: (ev) => {
      const vp = sx.state.viewport.get();
      if (!vp) return;
      if (ev.pointerType === "mouse" && ev.button !== 0) return;

      ev.preventDefault();
      ev.stopPropagation();

      const isRtl = sx.state.rtl.get();

      let startX: number | null = null;
      let anim: number | null = null;

      const style = getComputedStyle(vp);
      const overflow = style.overflowX;
      vp.style.overflowX = "hidden";

      const base = sx.state.columnBase.get();
      const minWidth = cell.column.widthMin ?? base.widthMin ?? DEFAULT_COLUMN_WIDTH_MIN;
      const maxWidth = cell.column.widthMax ?? base.widthMax ?? DEFAULT_COLUMN_WIDTH_MAX;

      const maxDelta = maxWidth - width;
      const minDelta = minWidth - width;

      const deltaRef = { current: 0 };
      const controller = new AbortController();

      document.addEventListener(
        "pointermove",
        (ev) => {
          if (startX === null) {
            startX = getClientX(ev);
            return;
          }

          const endAdjust = cell.colPin === "end" ? -1 : 1;
          const rtlAdjust = isRtl ? -1 : 1;

          deltaRef.current = clamp(
            minDelta,
            (getClientX(ev) - startX!) * endAdjust * rtlAdjust,
            maxDelta,
          );

          if (anim) return;
          anim = requestAnimationFrame(() => {
            const newWidth = width + deltaRef.current;

            sx.api.columnResize({ [cell.id]: newWidth });

            // TODO @Mike: the below method is a much faster, but potentially much tricky way to get resizing done. We should investigate
            // the best approach to lever this. The main issues are around resizing group headers and ensuring column cells pinned to the
            // end of the grid do not get shifted.

            // const id = sx.state.gridId.get();
            // const query = `[data-ln-row][data-ln-gridid="${id}"] [data-ln-cell="true"][data-ln-colindex="${cell.colStart}"]`;
            // const headerQuery = `[data-ln-header-row] [data-ln-header-cell="true"][data-ln-header-id="${cell.id}"]`;
            // const floatingQuery = `[data-ln-header-row] [data-ln-header-cell="true"][data-ln-header-id="${cell.id}"][data-ln-header-floating="true"]`;

            // const header = vp.querySelector(headerQuery) as HTMLElement;
            // const floating = vp.querySelector(floatingQuery) as HTMLElement | undefined;

            // if (!header) return;
            // const pin = header.getAttribute("data-ln-pin");

            // const cells = Array.from(vp.querySelectorAll(query)) as HTMLElement[];

            // const headers = [header];
            // if (floating) headers.push(floating);

            // headers.forEach((c) => {
            //   if (!isHTMLElement(c)) return;
            //   c.style.removeProperty("min-width");
            //   c.style.removeProperty("max-width");
            //   c.style.width = `${width + deltaRef.current}px`;

            //   if (pin === "end") {
            //     const viewportWidth = sx.state.viewportWidthInner.get();
            //     const spaceLeft = xPositions.at(-1)! - xPositions[cell.colStart];
            //     const x = viewportWidth - spaceLeft - deltaRef.current;
            //     c.style.transform = getTranslate(isRtl ? -x : x, 0);
            //   }
            // });

            // const widthPx = `${width + deltaRef.current}px`;

            // cells.forEach((c) => {
            //   if (!isHTMLElement(c)) return;
            //   c.style.minWidth = widthPx;
            //   c.style.maxWidth = widthPx;
            //   c.style.width = widthPx;
            // });

            // const headerAfterQuery = `${headerQuery} ~ [data-ln-header-cell="true"]`;
            // let after: HTMLElement[];
            // if (pin !== "end") {
            //   after = Array.from(vp.querySelectorAll(headerAfterQuery)) as HTMLElement[];
            // } else {
            //   after = [];
            // }

            // after.forEach((c) => {
            //   if (!isHTMLElement(c)) return;
            //   const thisPin = c.getAttribute("data-ln-pin");

            //   if (pin === "end" && thisPin === "end") return;
            //   if (pin !== "end" && thisPin === "end") return;

            //   const colindex = getColIndexFromEl(c);
            //   const transform = xPositions[colindex] + deltaRef.current;
            //   c.style.transform = getTranslate(transform * (isRtl ? -1 : 1), 0);
            // });

            anim = null;
          });
        },
        { signal: controller.signal },
      );

      window.addEventListener(
        "pointerup",
        () => {
          if (anim) cancelAnimationFrame(anim);
          controller.abort();

          vp.style.overflowX = overflow;
          const newWidth = width + deltaRef.current;

          sx.api.columnResize({ [cell.id]: newWidth });
        },
        { signal: controller.signal },
      );
    },

    className,
    style: {
      height: "100%",
      width: "6px",
      ...style,
      top: "0px",
      insetInlineEnd: cell.colPin !== "end" ? "0px" : undefined,
      insetInlineStart: cell.colPin === "end" ? "0px" : undefined,
      position: "absolute",
    },
  };

  const edge = useSlot({
    props: [defaultProps],
    slot: as ?? <div />,
  });

  return edge;
}
