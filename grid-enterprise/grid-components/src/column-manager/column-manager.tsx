import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";
import type { ListViewAxe } from "@1771technologies/react-list-view";
import type { ReactNode } from "react";

export interface ColumnManagerConfiguration {
  readonly dragPlaceholder?: (p: { label: string }) => ReactNode;
  readonly columnTree?: {
    readonly axe: ListViewAxe<ColumnEnterpriseReact<any>>;
    readonly labelDrag: string;
  };
  readonly columnBoxes?: {
    readonly labelValues: string;
    readonly labelRowGroups: string;
    readonly labelColumnPivots: string;
    readonly labelMeasures: string;

    readonly labelEmptyValues: string;
    readonly labelEmptyRowGroups: string;
    readonly labelEmptyColumnPivot: string;
    readonly labelEmptyMeasures: string;

    readonly iconRowGroups?: () => ReactNode;
    readonly iconValues?: () => ReactNode;
    readonly iconColumnPivots?: () => ReactNode;
    readonly iconMeasures?: () => ReactNode;
    readonly iconEmpty?: () => ReactNode;
  };
}
