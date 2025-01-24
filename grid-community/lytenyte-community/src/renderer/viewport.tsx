import { Sizer, type SizerProps } from "@1771technologies/react-sizer";
import { useEvent } from "@1771technologies/react-utils";
import { useGrid } from "../use-grid";
import { HeaderContainer } from "./header-container";
import { Rows } from "./rows";
import { useEffect, useRef, type ReactNode } from "react";
import { IsoResizeObserver } from "@1771technologies/js-utils";
import { RowContainer } from "./viewport/row-container";
import type { ColumnHeaderRendererParamsReact } from "@1771technologies/grid-types/community-react";
import { NavigationDriver } from "../navigation/navigation-driver";

export function Viewport({
  headerDefault,
}: {
  headerDefault: (p: ColumnHeaderRendererParamsReact<any>) => ReactNode;
}) {
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

  const resizeRef = useRef<ResizeObserver | null>(null);
  useEffect(() => {
    return () => resizeRef.current?.disconnect();
  }, []);

  const ref = useEvent((el: HTMLElement | null) => {
    state.internal.viewport.set(el);

    const re = new IsoResizeObserver(() => {
      if (el) {
        state.internal.viewportXScroll.set(Math.abs(el.scrollLeft));
        state.internal.viewportYScroll.set(Math.abs(el.scrollTop));
        state.internal.viewportInnerWidth.set(el.clientWidth);
        state.internal.viewportInnerHeight.set(el.clientHeight);
      }
    });
    if (el) re.observe(el);

    resizeRef.current = re;
  });

  const paginate = state.paginate.use();
  const totalHeight = paginate ? undefined : state.internal.rowPositions.use().at(-1)!;
  const totalWidth = state.internal.columnPositions.use().at(-1)!;

  const rtl = state.rtl.use();

  return (
    <Sizer
      onInit={onInit}
      onSizeChange={onSizeChange}
      onScroll={onScroll}
      elRef={ref}
      style={{ direction: rtl ? "rtl" : undefined }}
      className={css`
        display: grid;
        grid-template-rows: auto 1fr;
      `}
    >
      <HeaderContainer
        headerDefault={headerDefault}
        style={{ width: totalWidth }}
        className={css`
          position: sticky;
          z-index: 20;
          top: 0;
          inset-inline-start: 0px;
          min-width: 100%;
        `}
      />
      <RowContainer totalHeight={totalHeight} totalWidth={totalWidth}>
        <Rows width={totalWidth} />
      </RowContainer>
      <NavigationDriver />
    </Sizer>
  );
}
