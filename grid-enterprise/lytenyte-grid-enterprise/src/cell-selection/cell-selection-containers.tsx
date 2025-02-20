import { memo, useMemo } from "react";
import { useGrid } from "../use-grid";
import { isBottomRect, isCenterRect, isTopRect } from "@1771technologies/grid-core-enterprise";
import { CellStyleRow } from "./cell-style-row";

export const CellSelectionTop = memo(function CellSelectionTop() {
  const { state, api } = useGrid();

  const allRects = state.internal.cellSelectionSplits.use();

  const topRects = useMemo(() => {
    return allRects.filter((rect) => isTopRect(api, rect));
  }, [allRects, api]);

  const mode = state.cellSelectionMode.use();
  const showPivot = mode === "multi-range" || mode === "range";

  const additive = state.internal.cellSelectionAdditiveRects.use();
  const isDeselect = state.internal.cellSelectionIsDeselect.use();
  const pivot = state.internal.cellSelectionPivot.use();
  const additiveRects = useMemo(() => {
    if (!additive) return [];
    return additive.filter((rect) => isTopRect(api, rect));
  }, [additive, api]);

  return (
    <>
      {topRects.map((rect, i) => {
        return <CellStyleRow rect={rect} key={i} isRowPinnedTop />;
      })}
      {additiveRects.map((rect) => {
        return <CellStyleRow rect={rect} key={rect.columnStart} isDeselect={isDeselect} />;
      })}
      {showPivot && pivot && isTopRect(api, pivot) && (
        <CellStyleRow rect={pivot} isPivot isRowPinnedTop />
      )}
    </>
  );
});

export const CellSelectionCenter = memo(function CellSelectionCenter() {
  const { state, api } = useGrid();

  const allRects = state.internal.cellSelectionSplits.use();

  const pivot = state.internal.cellSelectionPivot.use();
  const centerRects = useMemo(() => {
    return allRects.filter((rect) => isCenterRect(api, rect));
  }, [allRects, api]);

  const additive = state.internal.cellSelectionAdditiveRects.use();
  const isDeselect = state.internal.cellSelectionIsDeselect.use();
  const additiveRects = useMemo(() => {
    if (!additive) return [];
    return additive.filter((rect) => isCenterRect(api, rect));
  }, [additive, api]);

  const mode = state.cellSelectionMode.use();
  const showPivot = mode === "multi-range" || mode === "range";

  return (
    <>
      {centerRects.map((rect, i) => {
        return <CellStyleRow rect={rect} key={i} />;
      })}
      {additiveRects.map((rect) => {
        return <CellStyleRow rect={rect} key={rect.columnStart} isDeselect={isDeselect} />;
      })}
      {showPivot && pivot && isCenterRect(api, pivot) && <CellStyleRow rect={pivot} isPivot />}
    </>
  );
});

export const CellSelectionBottom = memo(function CellSelectionBottom() {
  const { state, api } = useGrid();

  const allRects = state.internal.cellSelectionSplits.use();

  const pivot = state.internal.cellSelectionPivot.use();
  const bottomRects = useMemo(() => {
    return allRects.filter((rect) => isBottomRect(api, rect));
  }, [allRects, api]);

  const additive = state.internal.cellSelectionAdditiveRects.use();
  const isDeselect = state.internal.cellSelectionIsDeselect.use();
  const additiveRects = useMemo(() => {
    if (!additive) return [];
    return additive.filter((rect) => isBottomRect(api, rect));
  }, [additive, api]);

  const mode = state.cellSelectionMode.use();
  const showPivot = mode === "multi-range" || mode === "range";

  return (
    <>
      {bottomRects.map((rect, i) => {
        return <CellStyleRow rect={rect} key={i} isRowPinnedBottom />;
      })}
      {additiveRects.map((rect) => {
        return <CellStyleRow rect={rect} key={rect.columnStart} isDeselect={isDeselect} />;
      })}
      {showPivot && pivot && isBottomRect(api, pivot) && (
        <CellStyleRow rect={pivot} isPivot isRowPinnedBottom />
      )}
    </>
  );
});
