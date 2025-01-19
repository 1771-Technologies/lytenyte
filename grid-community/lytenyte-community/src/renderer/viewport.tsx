import { Sizer, type SizerProps } from "@1771technologies/react-sizer";
import { useEvent } from "@1771technologies/react-utils";
import { useGrid } from "../use-grid";
import { Header } from "./header";
import { Rows } from "./rows";
import { PinBorders } from "./pin-borders";

export function Viewport() {
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

  const totalHeight = state.internal.rowPositions.use().at(-1)!;
  const totalWidth = state.internal.columnPositions.use().at(-1)!;

  return (
    <Sizer
      onInit={onInit}
      onSizeChange={onSizeChange}
      onScroll={onScroll}
      elRef={ref}
      className={css`
        display: grid;
        grid-template-rows: 0px auto 1fr;
      `}
    >
      <PinBorders />
      <Header
        style={{ width: totalWidth, height: 200 }}
        className={css`
          position: sticky;
          z-index: 20;
          top: 0;
          inset-inline-start: 0px;
          min-width: 100%;
          background-color: green;
        `}
      />
      <div
        style={{ width: totalWidth, minHeight: totalHeight }}
        className={css`
          background-color: blue;
          display: grid;
          grid-template-columns: 1px;
          grid-template-rows: 1px;
        `}
      >
        <Rows />
      </div>
    </Sizer>
  );
}
