import { useEffect } from "react";
import {
  arrow,
  autoUpdate,
  computePosition,
  flip,
  getOverflowAncestors,
  hide,
  inline,
  offset,
  shift,
  type Alignment,
  type FloatingElement,
  type Middleware,
  type Placement,
  type Rect,
  type ReferenceElement,
} from "@1771technologies/lytenyte-floating";
import { resolveAlignment } from "./resolve-alignment.js";
import { resolveArrowOffset } from "./resolve-arrow-offset.js";
import { resolveSide } from "./resolve-side.js";
import { isElement } from "@1771technologies/lytenyte-dom-utils";

export type Side = "top" | "bottom" | "start" | "end";

export interface UsePositioner {
  readonly anchor?: ReferenceElement | null;
  readonly floating: FloatingElement | null;

  readonly arrow?: string;
  readonly arrowOffset?: number;
  readonly keepInView?: boolean;

  readonly shiftPadding?: number;

  readonly side?: Side;
  readonly sideOffset?: number;

  readonly align?: Alignment | "center";
  readonly alignOffset?: number;

  readonly inline?: boolean;

  readonly openStartDuration?: number;
  readonly active?: boolean;

  readonly rootBoundary?: "nearest" | "viewport" | "document" | Rect | HTMLElement;
}

export interface Position {
  readonly x: number;
  readonly y: number;
}

export function usePositioner({
  side = "bottom",
  align = "center",
  keepInView = true,
  shiftPadding = 16,
  arrow: arrowSelector,
  arrowOffset = 10,
  inline: inlineV = false,
  anchor,
  floating,
  sideOffset,
  alignOffset,
  openStartDuration,
  rootBoundary,
  active = true,
}: UsePositioner) {
  useEffect(() => {
    if (anchor == null || floating == null) return;

    if (!active) {
      floating.style.display = "none";
      return;
    }

    const clean = autoUpdate(anchor, floating, async () => {
      const style = getComputedStyle(floating);
      const isRtl = style.direction === "rtl";

      const placement = `${resolveSide(side, isRtl)}${resolveAlignment(align)}`;

      const middleware: Middleware[] = [];

      if (inlineV) middleware.push(inline({ padding: shiftPadding }));

      const arrowEl = arrowSelector
        ? (floating.querySelector(arrowSelector) as HTMLElement | null)
        : null;

      const arrowDim = resolveArrowOffset(arrowEl, side);

      middleware.push(
        offset({ mainAxis: (sideOffset ?? 0) + arrowDim, alignmentAxis: alignOffset }),
      );

      if (keepInView) {
        const flipMw = flip({
          crossAxis: "alignment",
          fallbackAxisSideDirection: "end",
        });

        let boundary: "document" | "viewport" | Rect | undefined = undefined;
        if (rootBoundary === "nearest") {
          /* v8 ignore next 1 */
          const element = isElement(anchor) ? anchor : anchor.contextElement;
          boundary = element
            ? getOverflowAncestors(element)
                .filter((c) => isElement(c))
                .at(0)
                /* v8 ignore next 2 */
                ?.getBoundingClientRect()
            : undefined;
        } else if (isElement(rootBoundary)) {
          boundary = rootBoundary.getBoundingClientRect();
        } else {
          boundary = rootBoundary;
        }

        const shiftMw = shift({
          padding: shiftPadding,
          mainAxis: true,
          rootBoundary: boundary,
        });
        const shiftMwX = shift({
          padding: shiftPadding,
          crossAxis: true,
          rootBoundary: boundary,
        });

        if (placement.includes("-")) middleware.push(flipMw, shiftMw, shiftMwX);
        else middleware.push(shiftMw, flipMw, shiftMwX);
      }

      middleware.push(hide());

      if (arrowEl) {
        middleware.push(arrow({ element: arrowEl, padding: arrowOffset }));
      }

      if (floating.style.display === "none") {
        setTimeout(() => {
          floating.removeAttribute("data-open-start");
        }, openStartDuration);
        floating.setAttribute("data-open-start", "true");
      }
      floating.style.display = "block";

      const pos = await computePosition(anchor, floating, {
        placement: placement as Placement,
        middleware,
      });

      const hidden = pos.middlewareData.hide?.referenceHidden;

      const anchorBB = anchor.getBoundingClientRect();
      const floatBB = floating.getBoundingClientRect();

      if (arrowEl) {
        const arrowData = pos.middlewareData.arrow!;
        const arrowBB = arrowEl.getBoundingClientRect();

        const offsetTop = placement.startsWith("top")
          ? `${floatBB.height}px`
          : `-${arrowBB.height}px`;
        const offsetLeft = placement.startsWith("left")
          ? `${floatBB.width}px`
          : `-${arrowBB.width}px`;

        Object.assign(arrowEl.style, {
          position: "absolute",
          /* v8 ignore next 1 */
          visibility: hidden ? "hidden" : "visible",
          top: arrowData.y ? `${arrowData.y}px` : offsetTop,
          left: arrowData.x ? `${arrowData.x}px` : offsetLeft,
        });
      }

      Object.assign(floating.style, {
        top: `${pos.y}px`,
        left: `${pos.x}px`,
        position: pos.strategy,
      });

      floating.style.setProperty("--reference-width", `${anchorBB.width}px`);
      floating.style.setProperty("--reference-height", `${anchorBB.height}px`);
      floating.style.setProperty("--floating-width", `${floatBB.width}px`);
      floating.style.setProperty("--floating-height", `${floatBB.height}px`);

      floating.setAttribute("data-reference-hidden", hidden ? "true" : "false");
      floating.setAttribute("data-side", side);
      floating.setAttribute("data-align", align);
    });

    return () => clean();
  }, [
    active,
    align,
    alignOffset,
    anchor,
    arrowOffset,
    arrowSelector,
    floating,
    inlineV,
    keepInView,
    openStartDuration,
    rootBoundary,
    shiftPadding,
    side,
    sideOffset,
  ]);
}
