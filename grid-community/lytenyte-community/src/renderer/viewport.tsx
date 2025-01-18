import { Sizer, type SizerProps } from "@1771technologies/react-sizer";
import { useEvent } from "@1771technologies/react-utils";
import { useGrid } from "../use-grid";

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
    }
  });

  const onInit = useEvent<Required<SizerProps>["onInit"]>((el, size) => {
    state.internal.viewport.set(el);
    onSizeChange(size);
  });

  const onScroll = useEvent(() => {
    const viewport = state.internal.viewport.peek();
    if (!viewport) return;

    state.internal.viewportXScroll.set(Math.abs(viewport.scrollLeft));
    state.internal.viewportYScroll.set(Math.abs(viewport.scrollTop));
  });

  return (
    <Sizer onInit={onInit} onSizeChange={onSizeChange} onScroll={onScroll}>
      <div
        className={css`
          position: sticky;
          top: 0;
          inset-inline-start: 0px;
          height: 200px;
          background-color: red;
        `}
      ></div>
      <div
        className={css`
          height: 4000px;
          width: 4000px;
        `}
      />
    </Sizer>
  );
}
