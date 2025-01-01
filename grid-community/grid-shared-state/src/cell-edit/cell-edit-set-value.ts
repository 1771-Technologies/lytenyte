import type { CellEditLocation } from "@1771technologies/grid-types/community";
import { cellEditKey } from "./cell-edit-key";
import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";

export const cellEditSetValue = <D, E>(
  a: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  p: CellEditLocation,
  v: unknown,
) => {
  const api = a as ApiCommunity<D, E>;
  const key = cellEditKey(p);
  const s = api.getState();

  const activeEditLocations = s.internal.cellEditActiveEdits.peek();
  if (!activeEditLocations.has(key)) return;

  const activeValues = s.internal.cellEditActiveEditValues.peek();
  const current = activeValues.get(key);

  if (current === v) return;

  const nextActive = new Map(activeValues);
  nextActive.set(key, v);

  s.internal.cellEditActiveEditValues.set(nextActive);

  api.eventFire("onCellEditValueChange", { api, location: p, newValue: v, oldValue: current });
};
