import type { Api } from "../make-grid-core.js";
import type { State } from "../state/state-core.js";

export type {
  InitialState as InitialStateCommunity,
  InitialStateAndInternalState as InitialStateAndInternalStateCommunity,
  State as StateCommunity,
  ColumnPivotSensitiveState as ColumnPivotSensitiveStateCommunity,
} from "../state/state-core.js";

export type StoreCommunity<D, E> = {
  readonly state: State<D, E>;
  readonly api: Api<D, E>;
};
