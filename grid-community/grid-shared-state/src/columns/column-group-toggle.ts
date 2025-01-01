import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";

export const columnGroupToggle = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  id: string,
  state?: boolean,
) => {
  const s = api.getState();
  const groupState = s.columnGroupExpansionState.peek();

  const nextValue = state == null ? !groupState[id] : state;

  const nextState = { ...groupState, [id]: nextValue };

  s.columnGroupExpansionState.set(nextState);
  (api as ApiCommunity<D, E>).eventFire(
    "onColumnGroupExpansionStateChange",
    api as ApiCommunity<D, E>,
  );
};
