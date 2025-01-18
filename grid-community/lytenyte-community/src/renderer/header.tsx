import { useState, type CSSProperties } from "react";
import { useGrid } from "../use-grid";
import { useIsoEffect } from "@1771technologies/react-utils";
import { getPreciseElementDimensions, IsoResizeObserver } from "@1771technologies/js-utils";

export interface HeaderProps {
  readonly style?: CSSProperties;
  readonly className?: string;
}

export function Header({ style, className }: HeaderProps) {
  const { state } = useGrid();

  const [header, setHeader] = useState<HTMLElement | null>(null);

  useIsoEffect(() => {
    if (!header) return;
    const resize = new IsoResizeObserver(() => {
      if (!header) return;

      const prec = getPreciseElementDimensions(header);
      state.internal.viewportHeaderHeight.set(prec.outerHeight);
    });

    resize.observe(header);

    return () => resize.disconnect();
  }, [header]);

  return <div ref={setHeader} className={className} style={style}></div>;
}
