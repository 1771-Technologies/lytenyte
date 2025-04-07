import type { ColumnPivotEvent } from "../types/column-pivot-pro";
import type { EventsCoreRaw, LngEvent } from "./events-core";

export interface EventsProRaw<A, D, C> extends EventsCoreRaw<A, D, C> {
  readonly onColumnPivotsChange: LngEvent<A>;
  readonly onColumnPivotsRequested: ColumnPivotEvent<A, C>;
  readonly onColumnPivotsResolved: ColumnPivotEvent<A, C>;
  readonly onColumnPivotsRejected: ColumnPivotEvent<A, C>;
  readonly onColumnPivotsSortModelChange: LngEvent<A>;
  readonly onColumnPivotsFilterModelChange: LngEvent<A>;
}

type LngEventNames = keyof EventsProRaw<any, any, any>;

export type LngAddEventListenerPro<A, D, C> = <K extends LngEventNames>(
  eventName: K,
  callback: EventsProRaw<A, D, C>[K],
) => () => void;

export type LngRemoveEventListenerPro<A, D, C> = <K extends LngEventNames>(
  eventName: K,
  callback: EventsProRaw<A, D, C>[K],
) => void;
