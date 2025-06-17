import { forwardRef, type JSX } from "react";
import { useForkRef } from "@1771technologies/lytenyte-react-hooks";
import { useGridRoot } from "../context";

export const Viewport = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(function Viewport(
  { children, style, ...props },
  forwarded,
) {
  const ctx = useGridRoot();

  const ref = useForkRef(ctx.ref, forwarded);

  return (
    <div
      {...props}
      role="grid"
      ref={ref}
      style={{ ...style, position: "relative", width: "100%", height: "100%", overflow: "auto" }}
    >
      {children}
    </div>
  );
});
