import { useEffect, useState, type PropsWithChildren } from "react";
import { useTreeRoot } from "../context.js";

export function ForceSyncScrolling(props: PropsWithChildren) {
  const [scroll, setScroll] = useState(0);
  const ctx = useTreeRoot();

  useEffect(() => {
    if (!ctx.panel) return;

    const controller = new AbortController();

    ctx.panel.addEventListener(
      "scroll",
      () => {
        setScroll(Math.max(0, ctx.panel!.scrollTop));
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [ctx.panel]);
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        height: 0,
        width: "100%",
        transform: `translate3d(0px, -${scroll}px, 0px)`,
      }}
    >
      {props.children}
    </div>
  );
}
