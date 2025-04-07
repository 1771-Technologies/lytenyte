import type { DragActive } from "@1771technologies/lytenyte-core/internal";
import type { ReactNode } from "react";
import type { ColumnProReact } from "../types";

export interface PillProps {
  kind?: "plain" | "column-pivot" | "row-group" | "column" | ({} & string);
  interactive?: boolean;
}

export interface RowProps {
  readonly pillSource: "columns" | "column-pivots" | "row-groups" | "measures" | "aggregations";
}
export interface PillProps {
  readonly children: (p: { pills: PillManagerPillItem[] }) => ReactNode;
}

export type DragTag = "row-group" | "column-pivot" | "columns" | "aggregations" | "measures";

export interface PillManagerPillItem {
  readonly kind: Required<PillProps>["kind"];
  readonly label: string;
  readonly secondaryLabel?: string;
  readonly active: boolean;

  readonly column?: ColumnProReact<any>;
  readonly isColumn?: boolean;
  readonly isRowGroup?: boolean;
  readonly isColumnPivot?: boolean;
  readonly isAggregation?: boolean;
  readonly isMeasure?: boolean;

  readonly draggable: boolean;
  readonly dragTags: DragTag[];
  readonly dragData?: any;

  readonly dropId: string;
  readonly dropTags: DragTag[];
  readonly dropData: any;

  readonly dragEnd?: (p: DragActive) => void;

  readonly onClick: () => void;
}
