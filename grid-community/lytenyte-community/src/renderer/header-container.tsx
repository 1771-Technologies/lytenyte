import { useState, type CSSProperties, type ReactNode } from "react";
import { useGrid } from "../use-grid";
import { useIsoEffect } from "@1771technologies/react-utils";
import { getPreciseElementDimensions, IsoResizeObserver } from "@1771technologies/js-utils";
import { Header } from "../header/header";
import type { ColumnHeaderRendererParamsReact } from "@1771technologies/grid-types/community-react";

export interface HeaderProps {
  readonly style?: CSSProperties;
  readonly className?: string;
  readonly headerDefault: (p: ColumnHeaderRendererParamsReact<any>) => ReactNode;
}

export function HeaderContainer({ headerDefault, style, className }: HeaderProps) {
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
    <div ref={setHeader} className={className} style={style}>
      <Header headerDefault={headerDefault} />
    </div>
  );
}
