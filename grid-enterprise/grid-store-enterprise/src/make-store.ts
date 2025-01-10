import { cascada } from "@1771technologies/react-cascada";
import type {
  PropsEnterprise,
  StateEnterprise,
  StoreEnterprise,
} from "@1771technologies/grid-types";
import { initialize } from "./initialize/initialize";
import { makeApi } from "./api/make-api";
import { initializeInternalState } from "./initialize/initialize-internal-state";
import { initializePivotSensitiveState } from "./initialize/initialize-pivot-sensitive-state";

export function makeStore<D, E>(props: PropsEnterprise<D, E>) {
  const store = cascada(() => {
    const apiInit = {} as StoreEnterprise<D, E>["api"];
    const stateInit = {} as StateEnterprise<D, E>;

    initialize(props, stateInit, apiInit);
    initializeInternalState(stateInit, apiInit);
    initializePivotSensitiveState(stateInit);

    const api = makeApi(stateInit, apiInit);

    return {
      state: stateInit,
      api,
    } satisfies StoreEnterprise<D, E>;
  });

  return store;
}
