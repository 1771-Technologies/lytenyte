import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import { sizeFromCoord } from "@1771technologies/js-utils";
import { Fragment, useMemo, type CSSProperties } from "react";
import { getTransform } from "../renderer/get-transform";
import { t } from "@1771technologies/grid-design";

interface FloatingCellProps {
  readonly api: ApiCommunityReact<any>;
  readonly column: ColumnCommunityReact<any>;
  readonly columnIndex: number;
  readonly viewportWidth: number;
  readonly rowStart: number;

  readonly xPositions: Uint32Array;
  readonly startCount: number;
  readonly centerCount: number;
  readonly endCount: number;
}
export function FloatingCell({
  api,
  viewportWidth,
  column,
  xPositions,
  columnIndex,
  rowStart,
}: FloatingCellProps) {
  const isStart = column.pin === "start";
  const isEnd = column.pin === "end";

  const rtl = api.getState().rtl.use();
  const style = useMemo(() => {
    const x = isEnd
      ? xPositions[columnIndex] - xPositions.at(-1)! + viewportWidth
      : xPositions[columnIndex];

    const width = sizeFromCoord(columnIndex, xPositions);
    const style = {
      transform: getTransform(x * (rtl ? -1 : 1), 0),
      gridRowStart: rowStart,
      gridRowEnd: rowStart + 1,
      width,
    } as CSSProperties;

    if (isStart || isEnd) {
      style.insetInlineStart = "0px";
      style.position = "sticky";
      style.zIndex = 2;
    }

    return style;
  }, [columnIndex, isEnd, isStart, rowStart, rtl, viewportWidth, xPositions]);

  const sx = api.getState();
  const base = sx.columnBase.use();
  const rendererKey = column.floatingCellRenderer ?? base.floatingCellRenderer;
  const renderers = sx.floatingCellRenderers.use();

  const Component = useMemo(() => {
    if (typeof rendererKey === "string") {
      if (renderers[rendererKey])
        throw new Error(`Failed to find floating renderer: ${rendererKey}`);

      return renderers[rendererKey];
    }

    if (!rendererKey) return Fragment;

    return rendererKey;
  }, [rendererKey, renderers]);

  return (
    <div
      style={style}
      className={css`
        grid-column-start: 1;
        grid-column-end: 2;
        overflow: hidden;
        box-sizing: border-box;
        background-color: ${t.colors.backgrounds_ui_panel};
        position: relative;
        border-block: 1px solid ${t.colors.borders_strong};

        &::after {
          position: absolute;
          content: "";
          width: 1px;
          height: calc(100% - 12px);
          inset-inline-end: 0px;
          top: 6px;
          background-color: ${t.colors.borders_pin_separator};
        }
      `}
    >
      <Component api={api} column={column} />
    </div>
  );
}
