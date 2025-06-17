import { useEffect, useLayoutEffect, useMemo, type PropsWithChildren } from "react";
import { useEvent, useMeasure, type RectReadOnly } from "@1771technologies/lytenyte-react-hooks";
import type { GridRootContext } from "./context";
import { RootProvider } from "./context";
import type { Grid } from "../+types";
import type { InternalAtoms } from "../state/+types";

export interface RootProps {
  readonly grid: Grid<any>;
}

export function Root({ grid, children }: PropsWithChildren<RootProps>) {
  const onViewportChange = useEvent((bounds: RectReadOnly) => {
    grid.state.viewport.set((element as HTMLElement) ?? null);
    grid.state.viewportHeightOuter.set(bounds.height);
    grid.state.viewportWidthOuter.set(bounds.width);
    grid.state.viewportWidthInner.set(element?.clientWidth ?? 0);
    grid.state.viewportHeightInner.set(element?.clientHeight ?? 0);
  });

  const [ref, bounds, , element] = useMeasure({
    onChange: onViewportChange,
  });

  useEffect(() => {
    return grid.state.widthTotal.watch(() => {
      const vp = grid.state.viewport.get();
      const width = grid.state.widthTotal.get();
      if (!vp) return;

      vp.style.setProperty("--lng-vp-total-width", `${width}px`);
    });
  }, [grid]);

  useLayoutEffect(() => {
    if (!element) return;

    grid.state.viewport.set((element as HTMLElement) ?? null);
    grid.state.viewportHeightOuter.set(bounds.height);
    grid.state.viewportWidthOuter.set(bounds.width);
    grid.state.viewportWidthInner.set(element?.clientWidth ?? 0);
    grid.state.viewportHeightInner.set(element?.clientHeight ?? 0);
  }, [
    bounds.height,
    bounds.width,
    element,
    grid.state.viewport,
    grid.state.viewportHeightInner,
    grid.state.viewportHeightOuter,
    grid.state.viewportWidthInner,
    grid.state.viewportWidthOuter,
  ]);

  const internal = (grid as Grid<any> & { internal: InternalAtoms }).internal;
  useEffect(() => {
    if (!element) return;

    const controller = new AbortController();
    (element as HTMLElement).addEventListener(
      "scroll",
      () => {
        internal.xScroll.set(Math.abs(element.scrollLeft));
        internal.yScroll.set(element.scrollTop);
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [element, internal.xScroll, internal.yScroll]);

  const value = useMemo<GridRootContext>(() => {
    return {
      ref,
      grid: grid as any,
    };
  }, [grid, ref]);

  return <RootProvider value={value}>{children}</RootProvider>;
}
