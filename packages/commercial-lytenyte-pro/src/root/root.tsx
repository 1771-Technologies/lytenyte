import { useEffect, useMemo, useState, type PropsWithChildren } from "react";
import type { GridRootContext } from "../context.js";
import { RootProvider } from "../context.js";
import type { Grid, GridEvents } from "../+types";
import type { InternalAtoms } from "../state/+types";
import { DialogDriver } from "./dialog-driver.js";
import { PopoverDriver } from "./popover-driver.js";
import { CellSelectionDriver } from "../cell-selection/cell-selection-driver.js";
import { hasAValidLicense, licenseState } from "../license.js";

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

    if (licenseState === "expired")
      invalidLicenseWatermark.innerHTML = `LyteNyte Grid: License key expired. Your license covers earlier versions only.`;
    else if (licenseState === "invalid")
      invalidLicenseWatermark.innerHTML = `LyteNyte Grid: Invalid license key. Please verify the key and try again.`;
    else
      invalidLicenseWatermark.innerHTML = `LyteNyte Grid PRO is being used for evaluation. 
      <a href="https://1771Technologies.com/pricing">Click here</a> to secure your license.`;

    document.body.appendChild(invalidLicenseWatermark);

    return () => invalidLicenseWatermark.remove();
  }, []);

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
