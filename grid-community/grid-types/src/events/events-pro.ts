import type { ColumnPivotEvent } from "../types-pro";
import type { EventsCommunity, LngEvent } from "./events-community";

export interface EventsEnterprise<A, D, C> extends EventsCommunity<A, D, C> {
  readonly onColumnPivotsChange: LngEvent<A>;
  readonly onColumnPivotsRequested: ColumnPivotEvent<A, C>;
  readonly onColumnPivotsResolved: ColumnPivotEvent<A, C>;
  readonly onColumnPivotsRejected: ColumnPivotEvent<A, C>;
  readonly onColumnPivotsSortModelChange: LngEvent<A>;
  readonly onColumnPivotsFilterModelChange: LngEvent<A>;
}

type LngEventNames = keyof EventsEnterprise<any, any, any>;

export type LngAddEventListenerEnterprise<A, D, C> = <K extends LngEventNames>(
  eventName: K,
  callback: EventsEnterprise<A, D, C>[K],
) => () => void;

export type LngRemoveEventListenerEnterprise<A, D, C> = <K extends LngEventNames>(
  eventName: K,
  callback: EventsEnterprise<A, D, C>[K],
) => void;
