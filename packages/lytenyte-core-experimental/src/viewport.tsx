import { forwardRef, memo, useState, type JSX } from "react";
import { useGridRoot } from "./root/context-grid.js";
import { useCombinedRefs } from "./hooks/use-combine-refs.js";

function ViewportImpl(
  { children, ...props }: JSX.IntrinsicElements["div"],
  ref: JSX.IntrinsicElements["div"]["ref"],
) {
  const [vp, setVp] = useState<HTMLDivElement | null>(null);
  const { setViewport, rtl, id } = useGridRoot();

  const combined = useCombinedRefs(ref, setViewport, setVp);

  return (
    <div
      {...props}
      role="grid"
      ref={combined}
      data-ln-viewport
      data-ln-gridid={id}
      style={{
        width: "100%",
        height: "100%",
        overflowX: "auto",
        overflowY: "auto",
        boxSizing: "border-box",
        direction: rtl ? "rtl" : "ltr",
        ...props.style,
      }}
    >
      {vp && children}
    </div>
  );
}

export const Viewport = memo(forwardRef(ViewportImpl));
