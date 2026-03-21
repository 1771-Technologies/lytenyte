import { memo, useMemo } from "react";
import { useCellSelection } from "../../../root/contexts/cell-selection-context.js";
import { bottomSection, centerSection, topSection } from "@1771technologies/lytenyte-shared";
import { CellSelectionRect } from "./cell-selection-rect.js";
import { useActiveRangeSelection } from "../../../root/contexts/active-range-context.js";

export const CellSelectionTop = memo(function CellSelectionTop() {
  const { cellSelectionsSplit: allRects } = useCellSelection();

  const { activeSplit } = useActiveRangeSelection();

  const cellSelectionIsDeselect = { current: false };
  const isDeselect = cellSelectionIsDeselect.current;

  const topRects = useMemo(() => {
    return allRects.filter((rect) => topSection[rect.section]);
  }, [allRects]);
  const additiveRects = useMemo(() => {
    return activeSplit.filter((rect) => topSection[rect.section]);
  }, [activeSplit]);

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
        return <CellSelectionRect rect={rect} key={i} />;
      })}
      {additiveRects.map((rect) => {
        return <CellSelectionRect rect={rect} key={rect.columnStart} isDeselect={isDeselect} />;
      })}
    </div>
  );
});

export const CellSelectionCenter = memo(function CellSelectionCenter() {
  const { cellSelectionsSplit: allRects } = useCellSelection();
  const { activeSplit } = useActiveRangeSelection();
  const cellSelectionIsDeselect = { current: false };
  const isDeselect = cellSelectionIsDeselect.current;

  const centerRects = useMemo(() => {
    return allRects.filter((rect) => centerSection[rect.section]);
  }, [allRects]);

  const additiveRects = useMemo(() => {
    return activeSplit.filter((rect) => centerSection[rect.section]);
  }, [activeSplit]);

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
        return <CellSelectionRect rect={rect} key={i} />;
      })}
      {additiveRects.map((rect) => {
        return <CellSelectionRect rect={rect} key={rect.columnStart} isDeselect={isDeselect} />;
      })}
    </div>
  );
});

export const CellSelectionBottom = memo(function CellSelectionBottom() {
  const { cellSelectionsSplit: allRects } = useCellSelection();
  const { activeSplit } = useActiveRangeSelection();
  const cellSelectionIsDeselect = { current: false };
  const isDeselect = cellSelectionIsDeselect.current;

  const bottomRects = useMemo(() => {
    return allRects.filter((rect) => bottomSection[rect.section]);
  }, [allRects]);

  const additiveRects = useMemo(() => {
    return activeSplit.filter((rect) => bottomSection[rect.section]);
  }, [activeSplit]);

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
        return <CellSelectionRect rect={rect} key={i} />;
      })}
      {additiveRects.map((rect) => {
        return <CellSelectionRect rect={rect} key={rect.columnStart} isDeselect={isDeselect} />;
      })}
    </div>
  );
});
