import { getHoveredColumnIndex, getHoveredRowIndex } from "@1771technologies/grid-core";
import type { ApiCommunityReact } from "@1771technologies/grid-types";
import { getClientX, getClientY } from "@1771technologies/js-utils";
import { getEditLocationKey } from "./cell-edit-location";

export function handleBeginCellEditFromEvent<D>(
  api: ApiCommunityReact<D>,
  event: MouseEvent | PointerEvent,
) {
  const clientY = getClientY(event);
  const clientX = getClientX(event);
  const rowIndex = getHoveredRowIndex(api, clientY);
  const columnIndex = getHoveredColumnIndex(api, clientX);

  if (rowIndex == null || columnIndex == null) return;

  const sx = api.getState();
  const active = sx.internal.cellEditActiveEdits.peek();
  const l = { rowIndex, columnIndex };
  const key = getEditLocationKey(l);
  if (active.has(key)) return;

  api.cellEditBegin(l, true);
}
