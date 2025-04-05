import type { ExportDataRectOptions } from "@1771technologies/grid-types/core";
import type {
  ApiCommunity,
  ApiEnterprise,
  ColumnCommunity,
  ColumnEnterprise,
} from "@1771technologies/grid-types";
import { getDataRect } from "./get-data-rect";

export const exportDataRect = <D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  opts:
    | ExportDataRectOptions<ApiEnterprise<D, E>, ColumnEnterprise<D, E>>
    | ExportDataRectOptions<ColumnCommunity<D, E>, ColumnCommunity<D, E>> = {},
) => {
  const s = api.getState();
  const rowCount = s.internal.rowCount.peek();
  const visible = s.columnsVisible.peek();

  const rowStart = opts.dataRect?.rowStart ?? 0;
  const rowEnd = opts.dataRect?.rowEnd ?? rowCount;
  const columnStart = opts.dataRect?.columnStart ?? 0;
  const columnEnd = opts.dataRect?.columnEnd ?? visible.length;

  const rows = s.internal.rowBackingDataSource.peek().rowGetMany(rowStart, rowEnd);

  if ("then" in rows) {
    return rows.then((rows) => {
      return getDataRect({
        rows,
        columnStart,
        columnEnd,
        api,
        transform: opts.transform as any,
        uniformGroupHeaders: opts.uniformGroupHeaders,
      });
    });
  }

  return getDataRect({
    rows,
    columnStart,
    columnEnd,
    api,
    transform: opts.transform as any,
    uniformGroupHeaders: opts.uniformGroupHeaders,
  });
};
