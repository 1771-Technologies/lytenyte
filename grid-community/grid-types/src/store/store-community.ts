import type { Api } from "../make-grid-community.js";
import type { State } from "./state-community.js";

export type {
  InitialState as InitialStateCommunity,
  InitialStateAndInternalState as InitialStateAndInternalStateCommunity,
  State as StateCommunity,
  ColumnPivotSensitiveState as ColumnPivotSensitiveStateCommunity,
} from "./state-community.js";

export type StoreCommunity<D, E> = {
  readonly state: State<D, E>;
  readonly api: Api<D, E>;
};
