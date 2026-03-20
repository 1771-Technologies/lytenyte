import { memo, useMemo } from "react";
import { CellStyleRow } from "./cell-style-row.js";
import { isTopRect } from "./is-top-rect.js";
import { isCenterRect } from "./is-center-rect.js";
import { isBottomRect } from "./is-bottom-rect.js";
import { useRoot } from "@1771technologies/lytenyte-core/internal";
import { useProRoot } from "../root/context.js";

export const CellSelectionTop = memo(function CellSelectionTop() {
  const { source } = useRoot();
  const {
    cellSelectionSplits: allRects,
    cellSelectionAdditiveRects: additive,
    cellSelectionIsDeselect,
  } = useProRoot();

  const topCount = source.useTopCount();

  const topRects = useMemo(() => {
    return allRects.filter((rect) => isTopRect(topCount, rect));
  }, [allRects, topCount]);

  const isDeselect = cellSelectionIsDeselect.current;

  const additiveRects = useMemo(() => {
    if (!additive) return [];
    return additive.filter((rect) => isTopRect(topCount, rect));
  }, [additive, topCount]);

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
    </div>
  );
});

export const CellSelectionCenter = memo(function CellSelectionCenter() {
  const { source } = useRoot();
  const {
    cellSelectionSplits: allRects,
    cellSelectionAdditiveRects: additive,
    cellSelectionIsDeselect,
  } = useProRoot();

  const topCount = source.useTopCount();
  const rowCount = source.useRowCount();
  const botCount = source.useBottomCount();

  const centerRects = useMemo(() => {
    return allRects.filter((rect) => isCenterRect(rowCount, botCount, topCount, rect));
  }, [allRects, botCount, rowCount, topCount]);

  const isDeselect = cellSelectionIsDeselect.current;
  const additiveRects = useMemo(() => {
    if (!additive) return [];
    return additive.filter((rect) => isCenterRect(rowCount, botCount, topCount, rect));
  }, [additive, botCount, rowCount, topCount]);

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
    </div>
  );
});

export const CellSelectionBottom = memo(function CellSelectionBottom() {
  const { source } = useRoot();
  const {
    cellSelectionSplits: allRects,
    cellSelectionAdditiveRects: additive,
    cellSelectionIsDeselect,
  } = useProRoot();

  const rowCount = source.useRowCount();
  const botCount = source.useBottomCount();

  const bottomRects = useMemo(() => {
    return allRects.filter((rect) => isBottomRect(rowCount, botCount, rect));
  }, [allRects, botCount, rowCount]);

  const isDeselect = cellSelectionIsDeselect.current;
  const additiveRects = useMemo(() => {
    if (!additive) return [];
    return additive.filter((rect) => isBottomRect(rowCount, botCount, rect));
  }, [additive, botCount, rowCount]);

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
    </div>
  );
});
