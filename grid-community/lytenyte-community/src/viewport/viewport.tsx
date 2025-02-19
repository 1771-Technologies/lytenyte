import "./viewport.css";

import { Sizer, type SizerProps } from "@1771technologies/react-sizer";
import { useEvent } from "@1771technologies/react-utils";
import { useGrid } from "../use-grid";
import { HeaderContainer } from "../header/header-container";
import { Rows } from "../rows/rows";
import { type PropsWithChildren, type ReactNode } from "react";
import { RowContainer } from "../row-container/row-container";
import { NavigationDriver } from "../navigation/navigation-driver";
import { CellEditDriver } from "../cell-edit/cell-edit-driver";
import { RowHoverDriver } from "../row-hover-driver/row-hover-driver";

export function Viewport({
  children,
  ...els
}: PropsWithChildren<{
  top: () => ReactNode;
  bottom: () => ReactNode;
  center: () => ReactNode;
}>) {
  const { state } = useGrid();

  const onSizeChange = useEvent<Required<SizerProps>["onSizeChange"]>((size) => {
    state.internal.viewportInnerHeight.set(size.innerHeight);
    state.internal.viewportInnerWidth.set(size.innerWidth);
    state.internal.viewportOuterWidth.set(size.outerWidth);
    state.internal.viewportOuterHeight.set(size.outerHeight);

    const el = state.internal.viewport.peek();
    if (el) {
      state.internal.viewportXScroll.set(Math.abs(el.scrollLeft));
      state.internal.viewportYScroll.set(Math.abs(el.scrollTop));
      state.internal.viewportInnerWidth.set(el.clientWidth);
      state.internal.viewportInnerHeight.set(el.clientHeight);
    }
  });

  const onInit = useEvent<Required<SizerProps>["onInit"]>((_, size) => {
    onSizeChange(size);
  });

  const onScroll = useEvent(() => {
    const viewport = state.internal.viewport.peek();
    if (!viewport) return;

    state.internal.viewportXScroll.set(Math.abs(viewport.scrollLeft));
    state.internal.viewportYScroll.set(Math.abs(viewport.scrollTop));
  });

  const ref = useEvent((el: HTMLElement | null) => {
    state.internal.viewport.set(el);
  });

  const paginate = state.paginate.use();
  const totalHeight = paginate ? undefined : state.internal.rowPositions.use().at(-1)!;
  const totalWidth = state.internal.columnPositions.use().at(-1)!;

  const rtl = state.rtl.use();
  const grid = state.gridId.use();

  return (
    <Sizer
      onInit={onInit}
      onSizeChange={onSizeChange}
      onScroll={onScroll}
      elRef={ref}
      style={{ direction: rtl ? "rtl" : undefined }}
      id={grid}
      className="lng1771-viewport"
    >
      <HeaderContainer style={{ width: totalWidth }} />
      <RowContainer totalHeight={totalHeight} totalWidth={totalWidth}>
        <Rows width={totalWidth} {...els} />
      </RowContainer>
      <NavigationDriver />
      <CellEditDriver />
      <RowHoverDriver />
      {children}
    </Sizer>
  );
}
