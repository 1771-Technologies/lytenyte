import type { Api } from "../make-grid-pro";
import type { State } from "./state-pro";

export type {
  InitialState as InitialStateEnterprise,
  InitialStateAndInternalState as InitialStateAndInternalStateEnterprise,
  State as StateEnterprise,
  ColumnPivotSensitiveStateEnterprise,
} from "./state-pro.js";

export type StoreEnterprise<D, E> = {
  readonly state: State<D, E>;
  readonly api: Api<D, E>;
};
