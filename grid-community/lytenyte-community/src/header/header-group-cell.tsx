import type { ColumnGroupRowItem, ColumnPin } from "@1771technologies/grid-types/community";
import { clsx, sizeFromCoord } from "@1771technologies/js-utils";
import { useMemo, type CSSProperties } from "react";
import { getTransform } from "../renderer/get-transform";
import { HeaderGroupDefault } from "./header-renderers/header-group-default";
import type { ApiCommunityReact } from "@1771technologies/grid-types";
import { useHeaderGroupMove } from "./use-header-group-move";
import { focusHeaderOutlineClx } from "./header-cell";
import { HEADER_GROUP_CELL } from "@1771technologies/grid-constants";

export interface HeaderGroupCellProps {
  readonly api: ApiCommunityReact<any>;
  readonly groupItem: ColumnGroupRowItem;
  readonly pin: ColumnPin;
  readonly rowStart: number;
  readonly viewportWidth: number;

  readonly xPositions: Uint32Array;
  readonly startCount: number;
  readonly centerCount: number;
  readonly endCount: number;
}

export function HeaderGroupCell({
  api,
  groupItem,
  pin,
  viewportWidth,
  rowStart,
  xPositions,
}: HeaderGroupCellProps) {
  const rtl = api.getState().rtl.use();
  const style = useMemo(() => {
    const isStart = pin === "start";
    const isEnd = pin == "end";
    const width = sizeFromCoord(groupItem.start, xPositions, groupItem.end - groupItem.start);

    const columnIndex = groupItem.start;

    const x = isEnd
      ? xPositions[columnIndex] - xPositions.at(-1)! + viewportWidth
      : xPositions[columnIndex];

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
  }, [groupItem.end, groupItem.start, pin, rowStart, rtl, viewportWidth, xPositions]);

  const headerMove = useHeaderGroupMove(api, groupItem, pin);

  return (
    <div
      style={style}
      data-lng1771-group-id={groupItem.id}
      aria-colindex={groupItem.start + 1}
      aria-colspan={groupItem.end - groupItem.start}
      role="columnheader"
      tabIndex={-1}
      {...headerMove.moveProps}
      className={clsx(
        HEADER_GROUP_CELL,
        css`
          grid-column-start: 1;
          grid-column-end: 1;
          overflow: hidden;
          position: relative;
        `,
        focusHeaderOutlineClx,
      )}
    >
      <HeaderGroupDefault group={groupItem} api={api} />
    </div>
  );
}
