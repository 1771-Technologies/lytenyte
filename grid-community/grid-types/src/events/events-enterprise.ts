import type { PropsEnterprise } from "../props/props-enterprise";
import type {
  ColumnFilterMenuOpenChangeParams,
  ColumnMenuOpenChangeParams,
  ColumnPivotEvent,
} from "../types-enterprise";
import type { EventsCommunity, LngEvent } from "./events-community";

export type PropEvents<A> = {
  [key in keyof Required<
    PropsEnterprise<any, any, any, any, any, any>
  > as `on${Capitalize<key>}Change`]: LngEvent<A>;
};

type PropsAndCommunity<A, D, C> = PropEvents<A> & EventsCommunity<A, D, C>;

export interface EventsEnterprise<A, D, C> extends PropsAndCommunity<A, D, C> {
  readonly onColumnPivotsChange: LngEvent<A>;
  readonly onColumnPivotsRequested: ColumnPivotEvent<A, C>;
  readonly onColumnPivotsResolved: ColumnPivotEvent<A, C>;
  readonly onColumnPivotsRejected: ColumnPivotEvent<A, C>;
  readonly onColumnPivotsSortModelChange: LngEvent<A>;
  readonly onColumnPivotsFilterModelChange: LngEvent<A>;

  readonly onColumnFilterMenuOpenChange: (p: ColumnFilterMenuOpenChangeParams<A, C>) => void;
  readonly onColumnMenuOpenChange: (p: ColumnMenuOpenChangeParams<A, C>) => void;
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
