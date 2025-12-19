import type { PositionFullWidthRow, PositionGridCell } from "./position.js";
import type { RowAbstract } from "./row-node.js";

export type APIExtension = Record<string, any>;

type WithId = { readonly id: string };

export type API<Row extends RowAbstract, Extension extends APIExtension> = {
  readonly columnField: (columnOrId: string | WithId, row: Row) => unknown;
  readonly rowDetailHeight: (rowId: WithId | string) => number;

  readonly scrollIntoView: (params: {
    readonly column?: number | string | WithId;
    readonly row?: number;
    readonly behavior?: "smooth" | "auto" | "instant";
  }) => void;

  readonly cellRoot: (row: number, column: number) => PositionGridCell | PositionFullWidthRow | null;

  readonly rowDetailExpanded: (rowOrId: Row | string | number) => boolean;
} & Extension;
