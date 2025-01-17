import type { ListViewAxe } from "@1771technologies/react-list-view";
import type { SelectItem } from "../select/select";

export interface FilterConfiguration {
  readonly simpleFilter?: {
    readonly placeholderNoChoice: string;

    readonly datePeriodAxe: ListViewAxe<SelectItem>;
    readonly dateOperatorAxe: ListViewAxe<SelectItem>;
    readonly numberOperatorAxe: ListViewAxe<SelectItem>;
    readonly textOperatorAxe: ListViewAxe<SelectItem>;
  };
}
