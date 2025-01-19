import { t } from "@1771technologies/grid-design";
import { useGrid } from "../use-grid";

export function PinBorders() {
  const { state } = useGrid();

  const viewportWidth = state.internal.viewportInnerWidth.use();
  const viewportHeight = state.internal.viewportInnerHeight.use();

  const startCount = state.columnVisibleStartCount.use();
  const endCount = state.columnVisibleEndCount.use();
  const centerCount = state.columnVisibleCenterCount.use();

  const xPositions = state.columnPositions.use();
  const endX = xPositions.at(centerCount + startCount)! - xPositions.at(-1)! + viewportWidth;

  return (
    <div
      className={css`
        position: sticky;
        width: 0px;
        height: 0px;
        min-height: 0px;
        max-height: 0px;
        top: 0px;
        inset-inline-start: 0px;
        z-index: 5;
        pointer-events: none;
      `}
    >
      {startCount > 0 && (
        <div
          className={css`
            position: absolute;
            width: 1px;
            background-color: ${t.colors.borders_pin_separator};
            top: 0px;
          `}
          style={{ height: viewportHeight, insetInlineStart: xPositions.at(startCount)! }}
        />
      )}
      {endCount > 0 && (
        <div
          className={css`
            position: absolute;
            width: 1px;
            background-color: ${t.colors.borders_pin_separator};
            top: 0px;
          `}
          style={{ height: viewportHeight, insetInlineStart: endX - 1 }}
        />
      )}
    </div>
  );
}
