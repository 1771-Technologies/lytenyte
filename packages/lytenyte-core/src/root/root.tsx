import { useEffect, useMemo, useState, type PropsWithChildren } from "react";
import type { GridRootContext } from "../context";
import { RootProvider } from "../context";
import type { Grid, GridEvents } from "../+types";
import type { InternalAtoms } from "../state/+types";

export type RootProps<T> = { readonly grid: Grid<T> } & {
  [k in keyof GridEvents<T> as `on${Capitalize<k>}`]: GridEvents<T>[k];
};

export function Root<T = any>({ grid, children, ...events }: PropsWithChildren<RootProps<T>>) {
  // Add event listeners in the standard react way
  useEffect(() => {
    const ev = Object.entries(events).map(([onName, fn]) => {
      if (!onName.startsWith("on")) return;
      const name = onName[2].toLowerCase() + onName.slice(3);
      return grid.api.eventAddListener(name as any, fn as any);
    });

    return () => ev.forEach((c) => c?.());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Object.values(events)]);

  const internal = (grid as Grid<any> & { internal: InternalAtoms }).internal;

  useEffect(() => {
    return internal.focusActive.watch(() => {
      const editActive = internal.editActivePos.get();
      if (!editActive) return;

      const focus = internal.focusActive.get();
      if (focus?.kind !== "cell") {
        grid.api.editEnd();
      } else {
        if (grid.api.editIsCellActive({ rowIndex: focus.rowIndex, column: focus.colIndex })) return;
        grid.api.editEnd();
      }
    });
  }, [grid.api, internal.editActivePos, internal.focusActive]);

  const [vp, ref] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!vp) return;

    const controller = new AbortController();
    vp.addEventListener(
      "scroll",
      () => {
        internal.xScroll.set(Math.abs(vp.scrollLeft));
        internal.yScroll.set(vp.scrollTop);
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [internal.xScroll, internal.yScroll, vp]);

  useEffect(() => {
    grid.state.viewport.set(vp);

    if (!vp) return;
    let observed = false;

    const obs = new ResizeObserver(() => {
      if (!observed) {
        observed = true;
        return;
      }

      grid.state.viewportHeightOuter.set(vp.offsetHeight);
      grid.state.viewportWidthOuter.set(vp.offsetWidth);
      grid.state.viewportWidthInner.set(vp.clientWidth);
      grid.state.viewportHeightInner.set(vp.clientHeight);
    });

    grid.state.viewportHeightOuter.set(vp.offsetHeight);
    grid.state.viewportWidthOuter.set(vp.offsetWidth);
    grid.state.viewportWidthInner.set(vp.clientWidth);
    grid.state.viewportHeightInner.set(vp.clientHeight);

    obs.observe(vp);

    return () => obs.disconnect();
  }, [
    grid.state.viewport,
    grid.state.viewportHeightInner,
    grid.state.viewportHeightOuter,
    grid.state.viewportWidthInner,
    grid.state.viewportWidthOuter,
    vp,
  ]);

  const value = useMemo<GridRootContext>(() => {
    return {
      ref,
      grid: grid as any,
    };
  }, [grid]);

  return <RootProvider value={value}>{children}</RootProvider>;
}
