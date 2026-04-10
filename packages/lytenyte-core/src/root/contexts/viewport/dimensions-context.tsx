import { createContext, memo, useContext, useState, type PropsWithChildren } from "react";
import { useViewportContext } from "./viewport-context.js";
import { useIsoEffect } from "../../../hooks/use-iso-effect.js";

export interface Dimension {
  readonly outerHeight: number;
  readonly innerHeight: number;
  readonly outerWidth: number;
  readonly innerWidth: number;
}

const defaultDimensions: Dimension = {
  outerHeight: 0,
  innerHeight: 0,
  outerWidth: 0,
  innerWidth: 0,
};

const context = createContext<Dimension>(defaultDimensions);

export const DimensionsContext = memo((props: PropsWithChildren) => {
  const { viewport: vp } = useViewportContext();

  const [viewportDimensions, setViewportDimensions] = useState(defaultDimensions);

  useIsoEffect(() => {
    if (!vp) return;

    let frame: number | null = null;
    const obs = new ResizeObserver(() => {
      if (frame) return;

      frame = requestAnimationFrame(() => {
        setViewportDimensions({
          outerHeight: vp.offsetHeight,
          innerHeight: vp.clientHeight,
          outerWidth: vp.offsetWidth,
          innerWidth: vp.clientWidth,
        });
        frame = null;
      });
    });
    obs.observe(vp);

    return () => obs.disconnect();
  }, [vp]);

  return <context.Provider value={viewportDimensions}>{props.children}</context.Provider>;
});

export const useDimensionContext = () => useContext(context);
