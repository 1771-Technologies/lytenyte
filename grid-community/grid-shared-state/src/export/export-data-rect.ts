import type { ApiPro, ExportDataRectOptionsPro } from "@1771technologies/grid-types/pro";
import { getDataRect } from "./get-data-rect";
import type { ApiCore, ExportDataRectOptionsCore } from "@1771technologies/grid-types/core";

export const exportDataRect = <D, E>(
  api: ApiPro<D, E> | ApiCore<D, E>,
  opts: ExportDataRectOptionsCore<D, E> | ExportDataRectOptionsPro<D, E> = {},
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
