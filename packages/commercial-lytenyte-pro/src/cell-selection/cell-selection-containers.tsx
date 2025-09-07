import { memo, useMemo } from "react";
import { CellStyleRow } from "./cell-style-row.js";
import { useGridRoot } from "../context.js";
import { isTopRect } from "./is-top-rect.js";
import { isCenterRect } from "./is-center-rect.js";
import { isBottomRect } from "./is-bottom-rect.js";

export const CellSelectionTop = memo(function CellSelectionTop() {
  const cx = useGridRoot();

  const allRects = cx.grid.internal.cellSelectionSplits.useValue();

  const topRects = useMemo(() => {
    return allRects.filter((rect) => isTopRect(cx.grid, rect));
  }, [allRects, cx.grid]);

  const mode = cx.grid.state.cellSelectionMode.useValue();
  const showPivot = mode === "multi-range" || mode === "range";

  const additive = cx.grid.internal.cellSelectionAdditiveRects.useValue();
  const isDeselect = cx.grid.internal.cellSelectionIsDeselect.useValue();
  const pivot = cx.grid.internal.cellSelectionPivot.useValue();

  const additiveRects = useMemo(() => {
    if (!additive) return [];
    return additive.filter((rect) => isTopRect(cx.grid, rect));
  }, [additive, cx.grid]);

  return (
    <div
      role="presentation"
      style={{
        width: "100%",
        height: 0,
        display: "grid",
        gridTemplateRows: "0px",
        gridTemplateColumns: "0px",
      }}
    >
      {topRects.map((rect, i) => {
        return <CellStyleRow rect={rect} key={i} isRowPinnedTop />;
      })}
      {additiveRects.map((rect) => {
        return <CellStyleRow rect={rect} key={rect.columnStart} isDeselect={isDeselect} />;
      })}
      {showPivot && pivot && isTopRect(cx.grid, pivot) && (
        <CellStyleRow rect={pivot} isPivot isRowPinnedTop />
      )}
    </div>
  );
});

export const CellSelectionCenter = memo(function CellSelectionCenter() {
  const cx = useGridRoot();

  const allRects = cx.grid.internal.cellSelectionSplits.useValue();

  const pivot = cx.grid.internal.cellSelectionPivot.useValue();
  const centerRects = useMemo(() => {
    return allRects.filter((rect) => isCenterRect(cx.grid, rect));
  }, [allRects, cx.grid]);

  const additive = cx.grid.internal.cellSelectionAdditiveRects.useValue();
  const isDeselect = cx.grid.internal.cellSelectionIsDeselect.useValue();
  const additiveRects = useMemo(() => {
    if (!additive) return [];
    return additive.filter((rect) => isCenterRect(cx.grid, rect));
  }, [additive, cx.grid]);

  const mode = cx.grid.state.cellSelectionMode.useValue();
  const showPivot = mode === "multi-range" || mode === "range";

  return (
    <div
      role="presentation"
      style={{
        width: "100%",
        height: 0,
        display: "grid",
        gridTemplateRows: "0px",
        gridTemplateColumns: "0px",
      }}
    >
      {centerRects.map((rect, i) => {
        return <CellStyleRow rect={rect} key={i} />;
      })}
      {additiveRects.map((rect) => {
        return <CellStyleRow rect={rect} key={rect.columnStart} isDeselect={isDeselect} />;
      })}
      {showPivot && pivot && isCenterRect(cx.grid, pivot) && <CellStyleRow rect={pivot} isPivot />}
    </div>
  );
});

export const CellSelectionBottom = memo(function CellSelectionBottom() {
  const cx = useGridRoot();

  const allRects = cx.grid.internal.cellSelectionSplits.useValue();

  const pivot = cx.grid.internal.cellSelectionPivot.useValue();
  const bottomRects = useMemo(() => {
    return allRects.filter((rect) => isBottomRect(cx.grid, rect));
  }, [allRects, cx.grid]);

  const additive = cx.grid.internal.cellSelectionAdditiveRects.useValue();
  const isDeselect = cx.grid.internal.cellSelectionIsDeselect.useValue();
  const additiveRects = useMemo(() => {
    if (!additive) return [];
    return additive.filter((rect) => isBottomRect(cx.grid, rect));
  }, [additive, cx.grid]);

  const mode = cx.grid.state.cellSelectionMode.useValue();
  const showPivot = mode === "multi-range" || mode === "range";

  return (
    <div
      role="presentation"
      style={{
        width: "100%",
        height: 0,
        display: "grid",
        gridTemplateRows: "0px",
        gridTemplateColumns: "0px",
      }}
    >
      {bottomRects.map((rect, i) => {
        return <CellStyleRow rect={rect} key={i} isRowPinnedBottom />;
      })}
      {additiveRects.map((rect) => {
        return <CellStyleRow rect={rect} key={rect.columnStart} isDeselect={isDeselect} />;
      })}
      {showPivot && pivot && isBottomRect(cx.grid, pivot) && (
        <CellStyleRow rect={pivot} isPivot isRowPinnedBottom />
      )}
    </div>
  );
});
