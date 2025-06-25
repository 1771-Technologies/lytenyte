import { type PropsWithChildren } from "react";
import { useGridRoot } from "../context";
import { getTranslate } from "@1771technologies/lytenyte-shared";

export function RowScrollForcePassive({ children }: PropsWithChildren) {
  const cx = useGridRoot();
  const top = cx.grid.internal.headerHeightTotal.useValue();
  const view = cx.grid.view.useValue();

  const offset = top + view.rows.rowTopTotalHeight;
  const scrollY = cx.grid.internal.yScroll.useValue();

  return (
    <>
      <div
        role="none"
        style={{
          position: "sticky",
          top: offset,
          height: 0,
          transform: getTranslate(0, -scrollY),
        }}
      >
        {children}
      </div>
      <div role="none" style={{ flex: 1 }} />
    </>
  );
}
