import { getHoveredColumnIndex, getHoveredRowIndex } from "@1771technologies/grid-core";
import { getClientX, getClientY } from "@1771technologies/js-utils";
import { cellEditLocation } from "./cell-edit-location";
import type { ApiCoreReact } from "@1771technologies/grid-types/core-react";

export function handleBeginCellEditFromEvent<D>(
  api: ApiCoreReact<D>,
  event: MouseEvent | PointerEvent,
) {
  if (event.button !== 0) return;

  const clientY = getClientY(event);
  const clientX = getClientX(event);
  const rowIndex = getHoveredRowIndex(api, clientY);
  const columnIndex = getHoveredColumnIndex(api, clientX);

  if (rowIndex == null || columnIndex == null) return;

  const sx = api.getState();
  const active = sx.internal.cellEditActiveEdits.peek();
  const l = { rowIndex, columnIndex };
  const key = cellEditLocation(l);
  if (active.has(key)) return;

  api.cellEditBegin(l, true);
}
