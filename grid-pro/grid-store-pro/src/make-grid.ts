import { cascada } from "@1771technologies/react-cascada";
import { initialize } from "./initialize/initialize";
import { makeApi } from "./api/make-api";
import { initializeInternalState } from "./initialize/initialize-internal-state";
import { initializePivotSensitiveState } from "./initialize/initialize-pivot-sensitive-state";
import type { GridPro, StateInitPro } from "@1771technologies/grid-types/pro";

export function makeGridPro<D, E>(props: StateInitPro<D, E>) {
  const store = cascada(() => {
    const apiInit = {} as GridPro<D, E>["api"];
    const stateInit = {} as GridPro<D, E>["state"];

    initialize(props, stateInit, apiInit);
    initializeInternalState(stateInit, apiInit);
    initializePivotSensitiveState(stateInit);

    const api = makeApi(stateInit, apiInit);

    return {
      state: stateInit,
      api,
    } satisfies GridPro<D, E>;
  });

  // Post initialization now that the store is ready. This ensures the validation of these fields
  // holds before the first use.
  store.state.columns.set((prev) => [...prev]);
  store.state.rowGroupModel.set((prev) => [...prev]);
  store.state.filterModel.set(props.filterModel ?? {});

  return store;
}
