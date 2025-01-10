import { cascada } from "@1771technologies/react-cascada";
import type { StateCommunity, StoreCommunity } from "@1771technologies/grid-types";
import { type PropsCommunity } from "@1771technologies/grid-types";
import { initialize } from "./initialize/initialize";
import { makeApi } from "./make-api";
import { initializeInternalState } from "./initialize/initialize-internal-state";
import { initializePivotSensitiveState } from "./initialize/initialize-pivot-sensitive-state";

export function makeStore<D, E>(props: PropsCommunity<D, E>) {
  const store = cascada(() => {
    const stateInit = {} as StateCommunity<D, E>;
    const apiInit = {} as StoreCommunity<D, E>["api"];

    initialize(props, stateInit, apiInit);
    initializeInternalState(stateInit, apiInit);
    initializePivotSensitiveState(stateInit);

    const api = makeApi(stateInit, apiInit);

    return {
      state: stateInit,
      api,
    } satisfies StoreCommunity<D, E>;
  });

  return store;
}
