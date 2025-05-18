import { cascada } from "@1771technologies/react-cascada";
import { initialize } from "./initialize/initialize";
import { makeApi } from "./make-api";
import { initializeInternalState } from "./initialize/initialize-internal-state";
import { initializePivotSensitiveState } from "./initialize/initialize-pivot-sensitive-state";
import type { GridCore, StateInitCore } from "@1771technologies/grid-types/core";

export function makeGridCore<D, E>(props: StateInitCore<D, E>) {
  const store = cascada(() => {
    const apiInit = {} as GridCore<D, E>["api"];
    const stateInit = {} as GridCore<D, E>["state"];

    initialize(props, stateInit, apiInit);
    initializeInternalState(stateInit, apiInit);
    initializePivotSensitiveState(stateInit);

    const api = makeApi(stateInit, apiInit);

    return {
      state: stateInit,
      api,
    } satisfies GridCore<D, E>;
  });

  // Post initialization now that the store is ready. This ensures the validation of these fields
  // holds before the first use.
  store.state.columns.set((prev) => [...prev]);
  store.state.rowGroupModel.set((prev) => [...prev]);

  return store as unknown as GridCore<D, E>;
}
