import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";
import type { ListViewAxe } from "@1771technologies/react-list-view";

export interface ColumnManagerConfiguration {
  readonly columnTree?: {
    readonly axe: ListViewAxe<ColumnEnterpriseReact<any>>;
    readonly dragLabel: string;
  };
}
