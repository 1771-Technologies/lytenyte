import type { ReactNode } from "react";
import type { ColumnAbstract, RowNode } from "@1771technologies/lytenyte-shared";
import type { GridSpec } from "./grid.js";
import type { API } from "./api.js";

export type PathField = { kind: "path"; path: string };

export interface RowParams<Spec extends GridSpec = GridSpec> {
  readonly rowIndex: number;
  readonly row: RowNode<Spec["data"]>;
  readonly api: API<Spec>;
}

export interface HeaderParams<Spec extends GridSpec = GridSpec> {
  readonly column: Column<Spec>;
  readonly api: API<Spec>;
}

export interface HeaderGroupParams<Spec extends GridSpec = GridSpec> {
  readonly collapsible: boolean;
  readonly groupPath: string[];
  readonly columns: Column<Spec>[];
  readonly api: API<Spec>;
}

export interface CellParams<Spec extends GridSpec = GridSpec> {
  readonly row: RowNode<Spec["data"]>;
  readonly column: Column<Spec>;
  readonly api: API<Spec>;
}

export interface CellParamsWithIndex<Spec extends GridSpec = GridSpec> extends CellParams<Spec> {
  readonly rowIndex: number;
  readonly colIndex: number;
}

export interface CellRendererParams<Spec extends GridSpec = GridSpec> extends CellParamsWithIndex<Spec> {
  readonly selected: boolean;
  readonly indeterminate: boolean;
  readonly detailExpanded: boolean;
}

export interface EditParams<Spec extends GridSpec = GridSpec> extends CellParamsWithIndex<Spec> {
  readonly editValue: unknown;
  readonly changeValue: (value: unknown) => boolean | Record<string, unknown>;
  readonly editData: unknown;
  readonly changeData: (data: unknown) => boolean | Record<string, unknown>;
  readonly commit: () => boolean | Record<string, unknown>;
  readonly cancel: () => void;
}

export type Field<T> = string | number | PathField | ((params: { row: RowNode<T> }) => unknown);

interface ColumnUnextended<Spec extends GridSpec = GridSpec> extends ColumnAbstract {
  readonly field?: Field<Spec["data"]>;

  readonly colSpan?: number | ((params: CellParamsWithIndex<Spec>) => number);
  readonly rowSpan?: number | ((params: CellParamsWithIndex<Spec>) => number);

  readonly autosizeCellFn?: (params: CellParams<Spec>) => number | null | undefined;
  readonly autosizeHeaderFn?: (params: HeaderParams<Spec>) => number | null | undefined;

  readonly floatingCellRenderer?: (props: HeaderParams<Spec>) => ReactNode;
  readonly headerRenderer?: (props: HeaderParams<Spec>) => ReactNode;
  readonly cellRenderer?: (props: CellRendererParams<Spec>) => ReactNode;

  readonly editRenderer?: (props: EditParams<Spec>) => ReactNode;
  readonly editable?: boolean | ((params: CellParamsWithIndex<Spec>) => boolean);
  readonly editSetter?: (
    params: Pick<EditParams<Spec>, "api" | "editValue" | "editData" | "row" | "column">,
  ) => unknown;
}

export type Column<Spec extends GridSpec = GridSpec> = ColumnUnextended<Spec> & Spec["column"];
