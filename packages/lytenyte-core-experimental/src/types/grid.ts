import type { RowSource } from "@1771technologies/lytenyte-shared";

export interface GridSpec<
  Data = unknown,
  ColExt extends Record<string, any> = object,
  S extends RowSource<Data> = RowSource,
  Ext extends Record<string, any> = object,
> {
  readonly data?: Data;
  readonly column?: ColExt;
  readonly source?: S;
  readonly api?: Ext;
}
