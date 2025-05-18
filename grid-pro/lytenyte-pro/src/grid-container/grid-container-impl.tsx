import "./grid-container.css";
import { useMemo, type PropsWithChildren, type ReactNode } from "react";

export interface GridContainerProps {
  readonly top?: ReactNode;
  readonly bottom?: ReactNode;
}

export function GridContainer({ top, bottom, children }: PropsWithChildren<GridContainerProps>) {
  const template = useMemo(() => {
    if (top && bottom) return "auto 1fr auto";
    if (top) return "auto 1fr";
    if (bottom) return "1fr auto";

    return "1fr";
  }, [bottom, top]);

  return (
    <div className="lng1771-grid-container" style={{ gridTemplateRows: template }}>
      {top && <div className="lng1771-grid-container__top">{top}</div>}
      {children}
      {bottom && <div className="lng1771-grid-container__bottom">{bottom}</div>}
    </div>
  );
}
