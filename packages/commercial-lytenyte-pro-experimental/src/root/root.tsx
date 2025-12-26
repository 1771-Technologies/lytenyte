import { Fallback, Root as RootCore } from "@1771technologies/lytenyte-core-experimental/internal";
import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import type { DataRectSplit, GridSpec as LnSpec } from "../types/grid.js";
import type { Column as LnColumn } from "../types/column.js";
import type { DataRect, API as LnAPI } from "../types/api.js";
import type { Props as LnProps } from "../types/props.js";
import type { RowSource } from "@1771technologies/lytenyte-shared";
import { useProAPI } from "./hooks/use-pro-api.js";
import { ProRootProvider, type ProContext } from "./context.js";
import { DialogDriver } from "../frames/dialog-driver.js";
import { hasAValidLicense, licenseState } from "../license.js";
import { PopoverDriver } from "../frames/popover-driver.js";
import { useControlled, useEvent, useRoot } from "@1771technologies/lytenyte-core-experimental/internal";
import { splitCellSelectionRect } from "../cell-selection/index.js";
import { splitOnPivot } from "../cell-selection/split-on-pivot.js";
import { CellSelectionDriver } from "../cell-selection/cell-selection-driver.js";
import {
  CellSelectionBottom,
  CellSelectionCenter,
  CellSelectionTop,
} from "../cell-selection/cell-selection-containers.js";

const RootWrapper = <Spec extends Root.GridSpec = Root.GridSpec>(
  { children, ...p }: PropsWithChildren<Root.Props<Spec>>,
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

  const components =
    p.cellSelectMode !== "none"
      ? {
          ln_topComponent: CellSelectionTop,
          ln_bottomComponent: CellSelectionBottom,
          ln_centerComponent: CellSelectionCenter,
        }
      : {};

  return (
    <RootCore ref={forwarded as any} {...(p as any)} {...components} __noFallback>
      <RootImpl {...(p as any)}>{children}</RootImpl>
    </RootCore>
  );
};

const RootImpl = ({ children, ...p }: PropsWithChildren<Root.Props>) => {
  const { view, source } = useRoot();
  const [openDialogFrames, setDialogFrames] = useState<ProContext["openDialogFrames"]>({});
  const [openPopoverFrames, setPopoverFrames] = useState<ProContext["openPopoverFrames"]>({});

  const api = useProAPI(setDialogFrames, setPopoverFrames);

  const cellSelectionMode = p.cellSelectMode ?? "none";
  const [cellSelections, setCellSelections] = useControlled({
    controlled: p.cellSelections,
    default: [],
  });
  const onCellSelectionChange = useEvent((rects: DataRect[]) => {
    p.onCellSelectionChange?.(rects);
    setCellSelections(rects);
  });

  const [cellSelectionPivot, setSelectionPivot] = useState<DataRectSplit | null>(null);
  const [cellSelectionAdditiveRects, setCellSelectionAdditiveRects] = useState<DataRectSplit[] | null>(null);
  const cellSelectionIsDeselect = useRef(false);

  const topCount = source.useTopCount();
  const rowCount = source.useRowCount();
  const botCount = source.useBottomCount();

  const cellSelectionSplits = useMemo(() => {
    const centerCount = rowCount - topCount - botCount;
    const selections = cellSelections;
    const p = cellSelectionPivot;

    const splits = selections.flatMap((rect) => {
      return splitCellSelectionRect({
        rect,
        rowTopCount: topCount,
        rowCenterCount: centerCount,
        colStartCount: view.startCount,
        colCenterCount: view.centerCount,
      });
    });

    const firstWithinPivot = splits.findIndex(
      (c) =>
        p &&
        p.rowStart >= c.rowStart &&
        p.rowEnd <= c.rowEnd &&
        p.columnStart >= c.columnStart &&
        p.columnEnd <= c.columnEnd,
    );

    if (firstWithinPivot !== -1) {
      const pivotSplits = splitOnPivot(splits[firstWithinPivot], p!);

      if (pivotSplits) splits.splice(firstWithinPivot, 1, ...pivotSplits);
      else splits.splice(firstWithinPivot, 1);
    }

    return splits;
  }, [botCount, cellSelectionPivot, cellSelections, rowCount, topCount, view.centerCount, view.startCount]);

  const value = useMemo<ProContext>(() => {
    return {
      api,

      openDialogFrames,
      setDialogFrames,
      openPopoverFrames,
      setPopoverFrames,

      cellSelectionMode,
      cellSelections,
      cellSelectionPivot,
      setSelectionPivot: setSelectionPivot,
      onCellSelectionChange,
      cellSelectionAdditiveRects,
      setCellSelectionAdditiveRects,
      cellSelectionIsDeselect,
      cellSelectionSplits,

      popoverFrames: p.popoverFrames ?? {},
      dialogFrames: p.dialogFrames ?? {},
    };
  }, [
    api,
    openDialogFrames,
    openPopoverFrames,
    cellSelectionMode,
    cellSelections,
    cellSelectionPivot,
    onCellSelectionChange,
    cellSelectionAdditiveRects,
    cellSelectionSplits,
    p.popoverFrames,
    p.dialogFrames,
  ]);

  return (
    <ProRootProvider value={value}>
      <DialogDriver />
      <PopoverDriver />
      {cellSelectionMode !== "none" && <CellSelectionDriver />}
      {children ?? <Fallback />}
    </ProRootProvider>
  );
};

export const Root = forwardRef(RootWrapper) as <Spec extends Root.GridSpec = Root.GridSpec>(
  props: PropsWithChildren<
    Root.Props<Spec> & (undefined extends Spec["api"] ? unknown : { apiExtension: Spec["api"] })
  >,
) => ReactNode;

export namespace Root {
  export type GridSpec<
    T = unknown,
    C extends Record<string, any> = object,
    S extends RowSource<T> = RowSource,
    E extends Record<string, any> = object,
  > = LnSpec<T, C, S, E>;

  export type Props<Spec extends GridSpec = GridSpec> = LnProps<Spec>;
  export type API<Spec extends GridSpec = GridSpec> = LnAPI<Spec>;
  export type Column<Spec extends GridSpec = GridSpec> = LnColumn<Spec>;
}
