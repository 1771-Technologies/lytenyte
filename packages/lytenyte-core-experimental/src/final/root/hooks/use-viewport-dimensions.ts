import { useReducer, useRef } from "react";
import { useIsoEffect } from "../../hooks/use-iso-effect.js";

export function useViewportDimensions(vp: HTMLDivElement | null) {
  const viewportDimensions = useRef({
    outerHeight: 0,
    innerHeight: 0,
    outerWidth: 0,
    innerWidth: 0,
  });

  const [, force] = useReducer((prev) => prev + 1, 0);
  useIsoEffect(() => {
    if (!vp) return;

    let frame: number | null = null;
    const obs = new ResizeObserver(() => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        Object.assign(viewportDimensions.current, {
          outerHeight: vp.offsetHeight,
          innerHeight: vp.clientHeight,
          outerWidth: vp.offsetWidth,
          innerWidth: vp.clientWidth,
        });
        frame = null;
        force();
      });
    });
    obs.observe(vp);

    return () => obs.disconnect();
  }, [vp]);

  return viewportDimensions.current;
}
