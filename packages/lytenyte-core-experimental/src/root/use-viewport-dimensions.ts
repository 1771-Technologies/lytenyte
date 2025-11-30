import { useReducer, useRef } from "react";
import { useIsoEffect } from "../hooks/use-iso-effect.js";

export function useViewportDimensions(vp: HTMLDivElement | null) {
  const outerHeight = useRef(0);
  const innerHeight = useRef(0);
  const outerWidth = useRef(0);
  const innerWidth = useRef(0);

  const versionRef = useRef(0);
  const [, force] = useReducer((prev) => prev + 1, 0);
  if (vp && versionRef.current === 0) {
    outerHeight.current = vp.offsetHeight;
    innerHeight.current = vp.clientHeight;
    outerWidth.current = vp.offsetWidth;
    innerWidth.current = vp.clientWidth;
  }

  useIsoEffect(() => {
    if (!vp) return;

    let frame: number | null = null;
    const obs = new ResizeObserver(() => {
      if (versionRef.current === 0) {
        versionRef.current = 1;
        return;
      }

      if (frame) return;
      frame = requestAnimationFrame(() => {
        outerHeight.current = vp.offsetHeight;
        innerHeight.current = vp.clientHeight;
        outerWidth.current = vp.offsetWidth;
        innerWidth.current = vp.clientWidth;
        frame = null;
      });
      force();
    });
    obs.observe(vp);

    return () => obs.disconnect();
  }, [vp]);

  return {
    innerWidth: innerWidth.current,
    innerHeight: innerHeight.current,
    outerWidth: outerWidth.current,
    outerHeight: outerHeight.current,
  };
}
