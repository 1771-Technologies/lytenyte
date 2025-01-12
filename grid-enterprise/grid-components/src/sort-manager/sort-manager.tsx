import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import type { SelectProps } from "../select/select";
import type { ReactNode } from "react";

export interface SortManagerConfiguration {
  readonly columnSelectComponent?: (s: SelectProps) => ReactNode;
  readonly sortSelectComponent?: (s: SelectProps) => ReactNode;
  readonly sortDirectionComponent?: (s: SelectProps) => ReactNode;
  readonly sortDeleteComponent?: () => ReactNode;

  readonly localization: {
    readonly sortTitle: string;
    readonly columnLabel: string;
    readonly sortLabel: string;
    readonly orderLabel: string;
    readonly sortApplyLabel: string;
    readonly sortCancelLabel: string;
  };

  readonly axe: {
    readonly ar: string;
  };

  readonly icons: {
    readonly dropdownChevron?: () => ReactNode;
    readonly deleteIcon?: () => ReactNode;
  };
}

export interface SortManagerProps<D> {
  readonly grid: StoreEnterpriseReact<D>;
}

export function SortManager<D>(props: SortManagerProps<D>) {
  void props;
  return <div></div>;
}
