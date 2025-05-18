import type { ApiCore } from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export const columnGroupToggle = <D, E>(
  api: ApiPro<D, E> | ApiCore<D, E>,
  id: string,
  state?: boolean,
) => {
  const s = api.getState();
  const groupState = s.columnGroupExpansionState.peek();

  const nextValue = state == null ? !(groupState[id] ?? true) : state;

  const nextState = { ...groupState, [id]: nextValue };

  s.columnGroupExpansionState.set(nextState);
};
