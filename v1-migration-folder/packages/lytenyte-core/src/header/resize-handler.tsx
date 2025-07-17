import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import type { HeaderCellLayout } from "../+types";
import { type CSSProperties, type JSX } from "react";
import {
  DEFAULT_COLUMN_WIDTH_MAX,
  DEFAULT_COLUMN_WIDTH_MIN,
  getColIndexFromEl,
  getTranslate,
  sizeFromCoord,
} from "@1771technologies/lytenyte-shared";
import { useGridRoot } from "../context";
import { getComputedStyle, isHTMLElement } from "@1771technologies/lytenyte-dom-utils";
import { clamp, getClientX } from "@1771technologies/lytenyte-js-utils";

interface ResizeHandlerProps<T> {
  readonly slot?: SlotComponent;
  readonly cell: HeaderCellLayout<T>;
  readonly xPositions: Uint32Array;
  readonly className?: string;
  readonly style?: CSSProperties;
}

export function ResizeHandler<T>({
  slot,
  cell,
  xPositions,
  style,
  className,
}: ResizeHandlerProps<T>) {
  const width = sizeFromCoord(cell.colStart, xPositions, cell.colSpan);
  const sx = useGridRoot().grid;

  const double = sx.state.columnDoubleClickToAutosize.useValue();

  const defaultProps: JSX.IntrinsicElements["div"] = {
    role: "button",
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
            const id = sx.state.gridId.get();
            const query = `[data-ln-row][data-ln-gridid="${id}"] [data-ln-cell="true"][data-ln-colindex="${cell.colStart}"]`;
            const headerQuery = `[data-ln-header-row] [data-ln-header-cell="true"][data-ln-header-id="${cell.id}"]`;

            const header = vp.querySelector(headerQuery) as HTMLElement;
            if (!header) return;
            const pin = header.getAttribute("data-ln-pin");

            const queryAfter = `${query} ~ [data-ln-cell="true"]`;
            const headerAfterQuery = `${headerQuery} ~ [data-ln-header-cell="true"]`;

            let after: HTMLElement[];
            if (pin !== "end") {
              after = Array.from(vp.querySelectorAll(queryAfter)).concat(
                Array.from(vp.querySelectorAll(headerAfterQuery)),
              ) as HTMLElement[];
            } else {
              after = [];
            }

            const q = Array.from(vp.querySelectorAll(query)) as HTMLElement[];
            q.push(header);

            q.forEach((c) => {
              if (!isHTMLElement(c)) return;
              c.style.removeProperty("min-width");
              c.style.removeProperty("max-width");
              c.style.width = `${width + deltaRef.current}px`;

              if (pin === "end") {
                const viewportWidth = sx.state.viewportWidthInner.get();
                const spaceLeft = xPositions.at(-1)! - xPositions[cell.colStart];
                const x = viewportWidth - spaceLeft - deltaRef.current;
                c.style.transform = getTranslate(isRtl ? -x : x, 0);
              }
            });

            after.forEach((c) => {
              if (!isHTMLElement(c)) return;
              const thisPin = c.getAttribute("data-ln-pin");

              if (pin === "end" && thisPin === "end") {
                return;
              }

              if (pin !== "end" && thisPin === "end") return;

              const colindex = getColIndexFromEl(c);
              const transform = xPositions[colindex] + deltaRef.current;
              c.style.transform = getTranslate(transform * (isRtl ? -1 : 1), 0);
            });

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
      width: "8px",
      ...style,
      top: "0px",
      insetInlineEnd: cell.colPin !== "end" ? "0px" : undefined,
      insetInlineStart: cell.colPin === "end" ? "0px" : undefined,
      position: "absolute",
    },
  };

  const edge = useSlot({
    props: [defaultProps],
    slot: slot ?? <div />,
  });

  return edge;
}
