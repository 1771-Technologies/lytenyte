import "./header-group-cell.css";

import { sizeFromCoord } from "@1771technologies/js-utils";
import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { useHeaderGroupMove } from "./use-header-group-move";
import { HEADER_GROUP_CELL_POSITION } from "@1771technologies/grid-constants";
import { useEvent } from "@1771technologies/react-utils";
import { getTransform } from "../utils/get-transform";
import { CollapseButton } from "../components/buttons";
import type { ApiCoreReact } from "@1771technologies/grid-types/core-react";
import type { ColumnGroupRowItemCore, ColumnPinCore } from "@1771technologies/grid-types/core";

export interface HeaderGroupCellProps {
  readonly api: ApiCoreReact<any>;
  readonly groupItem: ColumnGroupRowItemCore;
  readonly pin: ColumnPinCore;
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
  const ref = useRef<HTMLDivElement | null>(null);
  const skipRef = useRef(false);

  useEffect(() => {
    const sx = api.getState();
    const position = sx.internal.navigatePosition;
    const unsub = position.watch(() => {
      const pos = position.peek();
      if (!pos || !ref.current || pos.kind !== HEADER_GROUP_CELL_POSITION) return;

      if (
        groupItem.start === pos.columnStartIndex &&
        groupItem.end === pos.columnEndIndex &&
        pos.hierarchyRowIndex === rowStart - 1 &&
        !ref.current.contains(document.activeElement) &&
        ref.current !== document.activeElement
      ) {
        api.navigateScrollIntoView(null, pos.columnIndex);
        skipRef.current = true;
        ref.current.focus();
      }
    });

    return () => unsub();
  }, [api, groupItem.end, groupItem.start, rowStart]);

  const onFocus = useEvent(() => {
    if (skipRef.current) {
      skipRef.current = false;
      return;
    }

    api.getState().internal.navigatePosition.set({
      kind: HEADER_GROUP_CELL_POSITION,
      columnStartIndex: groupItem.start,
      columnEndIndex: groupItem.end,
      columnIndex: groupItem.start,
      hierarchyRowIndex: rowStart - 1,
    });
  });

  const Renderer = api.getState().columnGroupHeaderRenderer.use() ?? HeaderGroupDefault;

  return (
    <div
      ref={ref}
      onFocus={onFocus}
      style={style}
      data-lng1771-group-id={groupItem.id}
      data-lng1771-kind="header-group"
      aria-colindex={groupItem.start + 1}
      aria-colspan={groupItem.end - groupItem.start}
      role="columnheader"
      tabIndex={-1}
      {...headerMove.moveProps}
      className="lng1771-header__group"
    >
      <Renderer group={groupItem} api={api} />
    </div>
  );
}

interface HeaderGroupRendererProps {
  readonly group: ColumnGroupRowItemCore;
  readonly api: ApiCoreReact<any>;
}

function HeaderGroupDefault({ group, api }: HeaderGroupRendererProps) {
  const label = useMemo(() => {
    const delimiter = api.getState().columnGroupIdDelimiter.peek();
    return group.id.split(delimiter).at(-1)!;
  }, [api, group.id]);

  const expansionState = api.getState().columnGroupExpansionState.use();
  const isExpanded =
    expansionState[group.id] ?? api.getState().columnGroupDefaultExpansion.peek()(group.id);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
        justifyContent: "space-between",
        paddingInline: 12,
      }}
    >
      {label}
      {group.isCollapsible && isExpanded && (
        <CollapseButton onClick={() => api.columnGroupToggle(group.id)}>-</CollapseButton>
      )}
    </div>
  );
}
