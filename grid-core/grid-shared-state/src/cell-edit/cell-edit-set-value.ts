import type { ApiPro } from "@1771technologies/grid-types/pro";
import { cellEditKey } from "./cell-edit-key";
import type { ApiCore, CellEditLocationCore } from "@1771technologies/grid-types/core";

export const cellEditSetValue = <D, E>(
  a: ApiPro<D, E> | ApiCore<D, E>,
  p: CellEditLocationCore,
  v: unknown,
) => {
  const api = a as ApiCore<D, E>;
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
