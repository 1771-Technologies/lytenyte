import { forwardRef, type JSX } from "react";
import { useForkRef } from "@1771technologies/lytenyte-react-hooks";
import { useGridRoot } from "../context";

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

  return (
    <div
      tabIndex={0}
      {...props}
      role="grid"
      ref={ref}
      style={{
        ...style,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        overflow: "auto",
        direction: rtl ? "rtl" : "ltr",
      }}
    >
      {vp && children}
      {/* Prevents layouts shifts when the viewport size has not been retrieved. */}
      {!vp && <div style={{ width, height }} />}
    </div>
  );
});
