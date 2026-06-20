import { useEffect, useState } from "react";
import { useSuppressScrollFlashContext, useViewportContext } from "../contexts/viewport/viewport-context.js";

export function useSyncScrollXY() {
  const { viewport } = useViewportContext();
  const sync = useSuppressScrollFlashContext();
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    if (!viewport || !sync) return;

    const handle = () => {
      raf = null;
      setY(viewport.scrollTop);
      setX(viewport.scrollLeft);
    };

    const controller = new AbortController();
    let raf: null | number = null;
    viewport.addEventListener(
      "scroll",
      () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          handle();
        });
      },
      { signal: controller.signal },
    );

    handle();

    return () => controller.abort();
  }, [sync, viewport]);

  return { x, y, sync };
}
