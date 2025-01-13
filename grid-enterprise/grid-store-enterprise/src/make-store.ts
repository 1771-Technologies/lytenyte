import { cascada } from "@1771technologies/react-cascada";
import type { PropsEnterpriseReact, StoreEnterpriseReact } from "@1771technologies/grid-types";
import { initialize } from "./initialize/initialize";
import { makeApi } from "./api/make-api";
import { initializeInternalState } from "./initialize/initialize-internal-state";
import { initializePivotSensitiveState } from "./initialize/initialize-pivot-sensitive-state";

export function makeStore<D>(props: PropsEnterpriseReact<D>) {
  const store = cascada(() => {
    const apiInit = {} as StoreEnterpriseReact<D>["api"];
    const stateInit = {} as StoreEnterpriseReact<D>["state"];

    initialize(props, stateInit, apiInit);
    initializeInternalState(stateInit, apiInit);
    initializePivotSensitiveState(stateInit);

    const api = makeApi(stateInit, apiInit);

    return {
      state: stateInit,
      api,
    } satisfies StoreEnterpriseReact<D>;
  });

  // Post initialization now that the store is ready. This ensures the validation of these fields
  // holds before the first use.
  store.state.columns.set((prev) => [...prev]);

  return store;
}
