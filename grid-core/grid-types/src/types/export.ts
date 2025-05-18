import type { ApiCore, ColumnCore } from "../export-core";
import type { ApiPro, ColumnPro } from "../export-pro";

export interface DataRect {
  readonly rowStart: number;
  readonly rowEnd: number;
  readonly columnStart: number;
  readonly columnEnd: number;
}
export interface ExportTransformDataRowParams<A, C> {
  readonly api: A;
  readonly columns: C[];
  readonly data: unknown[];
}
export type ExportTransformDataRow<A, C> = (p: ExportTransformDataRowParams<A, C>) => unknown[];

export interface ExportCsvOptions<A, C> {
  readonly includeHeader?: boolean;
  readonly includeGroupHeaders?: boolean;
  readonly uniformGroupHeaders?: boolean;
  readonly delimiter?: "," | ";" | "\t" | (string & {});
  readonly transform?: ExportTransformDataRow<A, C>;
  readonly dataRect?: DataRect;
}

export interface ExportDataRectOptions<A, C> {
  readonly dataRect?: DataRect;
  readonly transform?: ExportTransformDataRow<A, C>;
  readonly uniformGroupHeaders?: boolean;
}

export interface DataRectResult<C> {
  readonly header: string[];
  readonly groupHeaders: (string | null)[][];
  readonly data: unknown[][];
  readonly columns: C[];
}

// Additional

export type DataRectCore = DataRect;
export type ExportTransformDataRowParamsCore<D, E> = ExportTransformDataRowParams<
  ApiCore<D, E>,
  ColumnCore<D, E>
>;
export type ExportTransformDataRowCore<D, E> = ExportTransformDataRow<
  ApiCore<D, E>,
  ColumnCore<D, E>
>;
export type ExportCsvOptionsCore<D, E> = ExportCsvOptions<ApiCore<D, E>, ColumnCore<D, E>>;
export type ExportDataRectOptionsCore<D, E> = ExportDataRectOptions<
  ApiCore<D, E>,
  ColumnCore<D, E>
>;
export type DataRectResultCore<D, E> = DataRectResult<ColumnCore<D, E>>;

export type DataRectPro = DataRect;
export type ExportTransformDataRowParamsPro<D, E> = ExportTransformDataRowParams<
  ApiPro<D, E>,
  ColumnPro<D, E>
>;
export type ExportTransformDataRowPro<D, E> = ExportTransformDataRow<ApiPro<D, E>, ColumnPro<D, E>>;
export type ExportCsvOptionsPro<D, E> = ExportCsvOptions<ApiPro<D, E>, ColumnPro<D, E>>;
export type ExportDataRectOptionsPro<D, E> = ExportDataRectOptions<ApiPro<D, E>, ColumnPro<D, E>>;
export type DataRectResultPro<D, E> = DataRectResult<ColumnPro<D, E>>;
