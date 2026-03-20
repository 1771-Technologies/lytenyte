import type * as Core from "@1771technologies/lytenyte-core/types";
import { Root as RootCore } from "@1771technologies/lytenyte-core/internal";
import { forwardRef, memo, useEffect, type PropsWithChildren, type ReactNode } from "react";
import type { RowSource } from "@1771technologies/lytenyte-shared";
import { hasAValidLicense, licenseState } from "../license.js";

const RootWrapper = <Spec extends Root.GridSpec = Root.GridSpec>(
  props: PropsWithChildren<
    Root.Props<Spec> & (undefined extends Spec["api"] ? object : { apiExtension: Spec["api"] })
  >,
  forwarded: Root.Props<Spec>["ref"],
) => {
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

  return <RootCore ref={forwarded as any} {...(props as any)} />;
};

export const Root = memo(forwardRef(RootWrapper)) as <Spec extends Root.GridSpec = Root.GridSpec>(
  props: PropsWithChildren<
    Root.Props<Spec> & (undefined extends Spec["api"] ? object : { apiExtension: Spec["api"] })
  >,
) => ReactNode;

export namespace Root {
  export type GridSpec<
    T = unknown,
    C extends Record<string, any> = object,
    S extends RowSource<T> = RowSource,
    E extends Record<string, any> = object,
  > = Core.GridSpec<T, C, S, E>;

  export type Props<Spec extends GridSpec = GridSpec> = Core.Props<Spec>;
  export type API<Spec extends GridSpec = GridSpec> = Core.API<Spec>;
  export type Column<Spec extends GridSpec = GridSpec> = Core.Column<Spec>;
}
