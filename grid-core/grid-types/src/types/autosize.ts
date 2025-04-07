import type { ApiCore, ColumnCore } from "../export-core";
import type { ApiPro, ColumnPro } from "../export-pro";
import type { RowNode } from "./row-nodes";

export interface AutosizeOptions {
  readonly dryRun?: boolean;
  readonly includeHeader?: boolean;
}

export type AutosizeCellParameters<A, D, C> = {
  readonly column: C;
  readonly row: RowNode<D>;
  readonly api: A;
};

export interface AutosizeResult {
  readonly [columnId: string]: number;
}

export type AutosizeHeaderParameters<A, C> = {
  readonly column: C;
  readonly api: A;
};

// Simplified
export type AutosizeOptionsCore = AutosizeOptions;
export type AutosizeCellParametersCore<D, E> = AutosizeCellParameters<
  ApiCore<D, E>,
  D,
  ColumnCore<D, E>
>;
export type AutosizeResultCore = AutosizeResult;
export type AutosizeHeaderParametersCore<D, E> = AutosizeHeaderParameters<
  ApiCore<D, E>,
  ColumnCore<D, E>
>;

export type AutosizeOptionsPro = AutosizeOptions;
export type AutosizeCellParametersPro<D, E> = AutosizeCellParameters<
  ApiPro<D, E>,
  D,
  ColumnPro<D, E>
>;
export type AutosizeResultPro = AutosizeResult;
export type AutosizeHeaderParametersPro<D, E> = AutosizeHeaderParameters<
  ApiPro<D, E>,
  ColumnPro<D, E>
>;
