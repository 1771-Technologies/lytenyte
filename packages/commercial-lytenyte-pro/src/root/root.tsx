import { useEffect, useLayoutEffect, useMemo, type PropsWithChildren } from "react";
import { useEvent, useMeasure, type RectReadOnly } from "@1771technologies/lytenyte-react-hooks";
import type { GridRootContext } from "../context.js";
import { RootProvider } from "../context.js";
import type { Grid, GridEvents } from "../+types";
import type { InternalAtoms } from "../state/+types";
import { DialogDriver } from "./dialog-driver.js";
import { PopoverDriver } from "./popover-driver.js";
import { CellSelectionDriver } from "../cell-selection/cell-selection-driver.js";
import { hasAValidLicense } from "../license.js";

export type RootProps<T> = { readonly grid: Grid<T> } & {
  [k in keyof GridEvents<T> as `on${Capitalize<k>}`]: GridEvents<T>[k];
};

export function Root<T = any>({ grid, children, ...events }: PropsWithChildren<RootProps<T>>) {
  useEffect(() => {
    if (hasAValidLicense) return;

    const existing = document.getElementById("lng1771-watermark");
    if (existing) return;

    const invalidLicenseWatermark = document.createElement("div");

    invalidLicenseWatermark.style.position = "fixed";
    invalidLicenseWatermark.style.bottom = "0px";
    invalidLicenseWatermark.style.insetInlineEnd = "0px";
    invalidLicenseWatermark.style.background = "rgb(255, 167, 167)";
    invalidLicenseWatermark.style.color = "black";
    invalidLicenseWatermark.style.fontSize = "1.2rem";
    invalidLicenseWatermark.style.fontWeight = "bold";
    invalidLicenseWatermark.style.border = "1px solid black";
    invalidLicenseWatermark.style.padding = "16px";

    invalidLicenseWatermark.innerHTML = `LyteNyte Grid PRO is being used for evaluation. 
      <a href="https://1771Technologies.com/pricing">Click here</a> to secure your license.`;

    document.body.appendChild(invalidLicenseWatermark);

    return () => invalidLicenseWatermark.remove();
  }, []);

  const onViewportChange = useEvent((bounds: RectReadOnly) => {
    grid.state.viewport.set((element as HTMLElement) ?? null);
    grid.state.viewportHeightOuter.set(bounds.height);
    grid.state.viewportWidthOuter.set(bounds.width);
    grid.state.viewportWidthInner.set(element?.clientWidth ?? 0);
    grid.state.viewportHeightInner.set(element?.clientHeight ?? 0);
  });

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

  const [ref, bounds, , element] = useMeasure({
    onChange: onViewportChange,
  });

  // Add css variables so that we can avoid re-renders
  useEffect(() => {
    return grid.state.widthTotal.watch(() => {
      const vp = grid.state.viewport.get();
      const width = grid.state.widthTotal.get();
      if (!vp) return;

      vp.style.setProperty("--lng-vp-total-width", `${width}px`);
    });
  }, [grid]);

  const internal = (grid as Grid<any> & { internal: InternalAtoms }).internal;
  // Listen to size changes of the window
  useLayoutEffect(() => {
    if (!element) return;

    const obs = new ResizeObserver(() => {
      grid.state.viewport.set((element as HTMLElement) ?? null);
      grid.state.viewportHeightOuter.set(bounds.height);
      grid.state.viewportWidthOuter.set(bounds.width);
      grid.state.viewportWidthInner.set(element?.clientWidth ?? 0);
      grid.state.viewportHeightInner.set(element?.clientHeight ?? 0);
    });

    obs.observe(element);

    const controller = new AbortController();
    (element as HTMLElement).addEventListener(
      "scroll",
      () => {
        internal.xScroll.set(Math.abs(element.scrollLeft));
        internal.yScroll.set(element.scrollTop);
      },
      { signal: controller.signal },
    );

    return () => {
      obs.disconnect();
      controller.abort();
    };
  }, [
    bounds.height,
    bounds.width,
    element,
    grid.state.viewport,
    grid.state.viewportHeightInner,
    grid.state.viewportHeightOuter,
    grid.state.viewportWidthInner,
    grid.state.viewportWidthOuter,
    internal.xScroll,
    internal.yScroll,
  ]);

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

  const value = useMemo<GridRootContext>(() => {
    return {
      ref,
      grid: grid as any,
    };
  }, [grid, ref]);

  const cellSelectionMode = grid.state.cellSelectionMode.useValue();

  return (
    <RootProvider value={value}>
      <DialogDriver />
      <PopoverDriver />
      {cellSelectionMode !== "none" && <CellSelectionDriver />}
      {children}
    </RootProvider>
  );
}
