import { forwardRef, type JSX } from "react";
import { useForkRef } from "@1771technologies/lytenyte-react-hooks";
import { useGridRoot } from "../context";
import { handleSkipInner } from "../navigation/handle-skip-inner";
import { useFocusTracking } from "./use-focus-tracking";
import { handleHorizontalArrow } from "./handle-horizontal-arrow";
import { handleVerticalArrow } from "./handle-vertical-arrow";
import { getFirstTabbable } from "@1771technologies/lytenyte-dom-utils";
import { ensureVisible } from "../navigation/ensure-visible";
import { handleHomeEnd } from "./handle-home-end";
import { handlePageUpDown } from "./handle-page-up-down";

export const Viewport = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(function Viewport(
  { children, style, ...props },
  forwarded,
) {
  const ctx = useGridRoot();

  const ref = useForkRef(ctx.ref, forwarded);

  const vp = ctx.grid.state.viewport.useValue();
  const width = ctx.grid.state.widthTotal.useValue();
  const height = ctx.grid.state.heightTotal.useValue();
  const rtl = ctx.grid.state.rtl.useValue();

  const focused = useFocusTracking(vp, ctx);

  const i = ctx.grid.internal;
  return (
    <>
      <div
        tabIndex={0}
        {...props}
        onKeyDown={(e) => {
          handleSkipInner(e);
          props.onKeyDown?.(e);

          const keys = [
            "ArrowRight",
            "ArrowLeft",
            "ArrowDown",
            "ArrowUp",
            "Home",
            "End",
            "PageUp",
            "PageDown",
          ];

          if (!keys.includes(e.key)) return;
          e.preventDefault();
          e.stopPropagation();

          const pos = i.focusActive.get();
          if (!pos) {
            if (e.key === "ArrowDown" || e.key === "ArrowRight") {
              const first = getFirstTabbable(vp!);
              if (first) {
                ensureVisible(first, ctx.grid.api.scrollIntoView);
                first.focus();
              }
            }

            return;
          }

          ctx.grid.api.scrollIntoView({
            column: pos.columnIndex,
            row: (pos as any).rowIndex,
            behavior: "instant",
          });

          setTimeout(() => {
            switch (e.key) {
              case "PageDown":
              case "PageUp": {
                handlePageUpDown(ctx, pos, e.key === "PageUp");
                break;
              }
              case "End":
              case "Home": {
                handleHomeEnd(ctx, pos, e.ctrlKey || e.metaKey, e.key === "Home");
                break;
              }
              case "ArrowLeft":
              case "ArrowRight": {
                handleHorizontalArrow(ctx, pos, e.key === "ArrowRight", e.ctrlKey || e.metaKey);
                break;
              }
              case "ArrowUp":
              case "ArrowDown": {
                handleVerticalArrow(ctx, pos, e.key === "ArrowDown", e.ctrlKey || e.metaKey);
                break;
              }
              default: {
                return;
              }
            }
          }, 4);
        }}
        role="grid"
        ref={ref}
        data-ln-viewport
        style={{
          ...style,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          overflow: style?.overflow ?? "auto",
          direction: rtl ? "rtl" : "ltr",
        }}
      >
        {vp && children}
        {/* Prevents layouts shifts when the viewport size has not been retrieved. */}
        {!vp && <div style={{ width, height }} />}
      </div>

      {!focused && (
        <div
          role="none"
          data-ln-focus-capture
          onFocusCapture={(e) => {
            e.preventDefault();
            e.stopPropagation();

            vp?.focus();
          }}
          tabIndex={0}
        />
      )}
    </>
  );
});
