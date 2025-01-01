import type { Api } from "../make-grid-enterprise";
import type { State } from "./state-enterprise";

export type {
  InitialState as InitialStateEnterprise,
  InitialStateAndInternalState as InitialStateAndInternalStateEnterprise,
  State as StateEnterprise,
  ColumnPivotSensitiveStateEnterprise,
} from "./state-enterprise.js";

export type StoreEnterprise<D, E> = {
  readonly state: State<D, E>;
  readonly api: Api<D, E>;
};
