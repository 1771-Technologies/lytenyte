import { useEffect } from "react";
import type { SubmenuProps } from "./submenu";
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  type Middleware,
} from "../../../external/floating-ui.js";
import { transformOrigin } from "../../dialog/transform-origin.js";

export function useSubmenuPosition({
  placement = "right-start",
  shiftPadding,
  sideOffset = 2,
  alignOffset = 0,
  sub,
  root,
}: Pick<SubmenuProps, "alignOffset" | "placement" | "shiftPadding" | "sideOffset"> & {
  sub: HTMLElement | null;
  root: HTMLElement | null;
}) {
  useEffect(() => {
    if (!sub || !open || !root) return;

    const middleware: Middleware[] = [offset({ alignmentAxis: alignOffset, mainAxis: sideOffset })];

    const flipMw = flip({
      crossAxis: "alignment",
      fallbackAxisSideDirection: "end",
    });

    const shiftMw = shift({
      padding: shiftPadding,
      mainAxis: true,
    });
    const shiftMwX = shift({
      padding: shiftPadding,
      crossAxis: true,
    });

    if (placement.includes("-")) middleware.push(flipMw, shiftMw, shiftMwX);
    else middleware.push(shiftMw, flipMw, shiftMwX);

    middleware.push(transformOrigin({ arrowHeight: 0, arrowWidth: 0 }));

    const clean = autoUpdate(root, sub, async () => {
      const pos = await computePosition(root, sub, {
        strategy: "fixed",
        placement: placement,
        middleware,
      });

      const x = pos.middlewareData.transformOrigin.x;
      const y = pos.middlewareData.transformOrigin.y;

      sub.style.transformOrigin = `${x} ${y}`;
      sub.style.top = `${pos.y}px`;
      sub.style.left = `${pos.x}px`;
    });

    return () => clean();
  }, [alignOffset, placement, root, shiftPadding, sideOffset, sub]);
}
