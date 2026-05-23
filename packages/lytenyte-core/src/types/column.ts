import type { ReactNode } from "react";
import type {
  ColumnAbstract,
  LayoutCell,
  LayoutFullWidthRow,
  RowNode,
} from "@1771technologies/lytenyte-shared";
import type { Grid } from "../index.js";

export type PathField = { kind: "path"; path: string };

export interface RowParams<Spec extends Grid.GridSpec = Grid.GridSpec> {
  readonly rowIndex: number;
  readonly row: RowNode<Spec["data"]>;
  readonly api: Grid.API<Spec>;
}

export interface RowFullWidthRendererParams<Spec extends Grid.GridSpec = Grid.GridSpec>
  extends RowParams<Spec> {
  readonly layout: LayoutFullWidthRow;
}

export interface HeaderParams<Spec extends Grid.GridSpec = Grid.GridSpec> {
  readonly column: Column<Spec>;
  readonly api: Grid.API<Spec>;
}

export interface HeaderGroupParams<Spec extends Grid.GridSpec = Grid.GridSpec> {
  readonly collapsible: boolean;
  readonly collapsed: boolean;
  readonly groupPath: string[];
  readonly columns: Column<Spec>[];
  readonly api: Grid.API<Spec>;
}

export interface CellParams<Spec extends Grid.GridSpec = Grid.GridSpec> {
  readonly row: RowNode<Spec["data"]>;
  readonly column: Column<Spec>;
  readonly api: Grid.API<Spec>;
}

export interface CellParamsWithIndex<Spec extends Grid.GridSpec = Grid.GridSpec> extends CellParams<Spec> {
  readonly rowIndex: number;
  readonly colIndex: number;
}

export interface CellRendererParams<Spec extends Grid.GridSpec = Grid.GridSpec>
  extends CellParamsWithIndex<Spec> {
  readonly selected: boolean;
  readonly indeterminate: boolean;
  readonly detailExpanded: boolean;
  readonly editData: unknown;
  readonly layout: LayoutCell;
}

export interface EditParams<Spec extends Grid.GridSpec = Grid.GridSpec> extends CellParamsWithIndex<Spec> {
  readonly editValue: unknown;
  readonly changeValue: (value: unknown) => boolean | Record<string, unknown>;
  readonly editData: unknown;
  readonly editValidation: boolean | Record<string, unknown>;
  readonly changeData: (data: unknown) => boolean | Record<string, unknown>;
  readonly commit: () => boolean | Record<string, unknown>;
  readonly cancel: () => void;
  readonly layout: LayoutCell;
}

export type Field<T> = string | number | PathField | ((params: { row: RowNode<T> }) => unknown);

interface ColumnUnextended<Spec extends Grid.GridSpec = Grid.GridSpec> extends ColumnAbstract {
  readonly field?: Field<Spec["data"]>;

  readonly colSpan?: number | ((params: CellParamsWithIndex<Spec>) => number);
  readonly rowSpan?: number | ((params: CellParamsWithIndex<Spec>) => number);

  readonly autosizeCellFn?: (params: CellParams<Spec>) => number | null | undefined;
  readonly autosizeHeaderFn?: (params: HeaderParams<Spec>) => number | null | undefined;

  readonly floatingCellRenderer?: (props: HeaderParams<Spec>) => ReactNode;
  readonly headerRenderer?: (props: HeaderParams<Spec>) => ReactNode;
  readonly cellRenderer?: (props: CellRendererParams<Spec>) => ReactNode;

  readonly editOnPrintable?: boolean;
  readonly editRenderer?: (props: EditParams<Spec>) => ReactNode;
  readonly editable?: boolean | ((params: CellParamsWithIndex<Spec>) => boolean);
  readonly editSetter?: (
    params: Pick<EditParams<Spec>, "api" | "editValue" | "editData" | "row" | "column">,
  ) => unknown;
  readonly editMutateCommit?: (params: Pick<EditParams<Spec>, "api" | "editData" | "row" | "column">) => void;
}

export type Column<Spec extends Grid.GridSpec = Grid.GridSpec> = ColumnUnextended<Spec> & Spec["column"];
