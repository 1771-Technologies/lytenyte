import { useEffect, useState, type PropsWithChildren } from "react";
import { useGridRoot } from "../context";
import { getTranslate } from "@1771technologies/lytenyte-shared";

export function RowScrollForcePassive({ children }: PropsWithChildren) {
  const cx = useGridRoot();
  const top = cx.grid.internal.headerHeightTotal.useValue();
  const view = cx.grid.view.useValue();

  const offset = top + view.rows.rowTopTotalHeight;

  const [el, setEl] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!el) return;

    return cx.grid.internal.yScroll.watch(() => {
      el.style.transform = getTranslate(0, -cx.grid.internal.yScroll.get());
    });
  }, [cx.grid.internal.yScroll, el]);

  return (
    <>
      <div
        ref={setEl}
        style={{
          position: "sticky",
          top: offset,
          height: 0,
        }}
      >
        {children}
      </div>
      <div role="none" style={{ flex: 1 }} />
    </>
  );
}
