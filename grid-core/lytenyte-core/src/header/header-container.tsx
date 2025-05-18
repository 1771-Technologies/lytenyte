import { useState, type CSSProperties } from "react";
import { useGrid } from "../use-grid";
import { useIsoEffect } from "@1771technologies/react-utils";
import { getPreciseElementDimensions, IsoResizeObserver } from "@1771technologies/js-utils";
import { Header } from "./header";

export interface HeaderProps {
  readonly style?: CSSProperties;
}

export function HeaderContainer({ style }: HeaderProps) {
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

  return (
    <div ref={setHeader} className="lng1771-header-container" style={style}>
      <Header />
    </div>
  );
}
