import { useEffect, type PropsWithChildren } from "react";
import type { Grid, GridEvents } from "../+types";
import { DialogDriver } from "./dialog-driver.js";
import { PopoverDriver } from "./popover-driver.js";
import { CellSelectionDriver } from "../cell-selection/cell-selection-driver.js";
import { hasAValidLicense, licenseState } from "../license.js";
import { Root as RootCore } from "@1771technologies/lytenyte-core/yinternal";

export type RootProps<T> = { readonly grid: Grid<T> } & {
  [k in keyof GridEvents<T> as `on${Capitalize<k>}`]: GridEvents<T>[k];
};

export function Root<T = any>({ children, grid, ...props }: PropsWithChildren<RootProps<T>>) {
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

  const cellSelectionMode = grid.state.cellSelectionMode.useValue();

  return (
    <RootCore {...(props as any)} grid={grid as any}>
      <DialogDriver />
      <PopoverDriver />
      {cellSelectionMode !== "none" && <CellSelectionDriver />}
      {children}
    </RootCore>
  );
}
