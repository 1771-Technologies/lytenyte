import type { ListViewAxe } from "@1771technologies/react-list-view";
import type { SelectItem } from "../select/select";

export interface FilterConfiguration {
  readonly simpleFilter?: {
    readonly placeholderNoChoice: string;

    readonly axeDatePeriod: ListViewAxe<SelectItem>;
    readonly axeDateOperator: ListViewAxe<SelectItem>;
    readonly axeNumberOperator: ListViewAxe<SelectItem>;
    readonly axeTextOperator: ListViewAxe<SelectItem>;

    readonly labelText: string;
    readonly labelNumber: string;
    readonly labelDate: string;
  };

  readonly inFilter?: {
    readonly labelItem: string;
    readonly labelLoadError: string;
    readonly labelNoItems: string;
  };

  readonly container?: {
    readonly labelCancel: string;
    readonly labelClear: string;
    readonly labelApply: string;
  };
}
