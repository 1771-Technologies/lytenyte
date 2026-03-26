import { memo, useMemo } from "react";
import { useRangeSelection } from "../../root/contexts/range-selection/range-selection-context.js";
import { bottomSection, centerSection, topSection } from "@1771technologies/lytenyte-shared";
import { CellSelectionRect } from "./cell-selection-rect.js";
import { useRangeActiveSelection } from "../../root/contexts/range-selection/range-selection-active-context.js";

export const CellSelectionTop = memo(function CellSelectionTop() {
  const { cellSelectionsSplit: allRects } = useRangeSelection();

  const { activeSplit, deselect } = useRangeActiveSelection();

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
        return <CellSelectionRect rect={rect} key={rect.columnStart} isDeselect={deselect} />;
      })}
    </div>
  );
});

export const CellSelectionCenter = memo(function CellSelectionCenter() {
  const { cellSelectionsSplit: allRects } = useRangeSelection();
  const { activeSplit, deselect } = useRangeActiveSelection();

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
        return <CellSelectionRect rect={rect} key={rect.columnStart} isDeselect={deselect} />;
      })}
    </div>
  );
});

export const CellSelectionBottom = memo(function CellSelectionBottom() {
  const { cellSelectionsSplit: allRects } = useRangeSelection();
  const { activeSplit, deselect } = useRangeActiveSelection();

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
        return <CellSelectionRect rect={rect} key={rect.columnStart} isDeselect={deselect} />;
      })}
    </div>
  );
});
