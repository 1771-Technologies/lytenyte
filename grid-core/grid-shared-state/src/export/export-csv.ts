import type { ApiPro } from "@1771technologies/grid-types/pro";
import { getDataRect } from "./get-data-rect";
import type { ApiCore, ExportCsvOptionsCore, RowNodeCore } from "@1771technologies/grid-types/core";

export const exportCsv = <D, E>(
  api: ApiPro<D, E> | ApiCore<D, E>,
  opts: ExportCsvOptionsCore<D, E> = {},
) => {
  const s = api.getState();
  const rowCount = s.internal.rowCount.peek();
  const rowStart = opts.dataRect?.rowStart ?? 0;
  const rowEnd = opts.dataRect?.rowEnd ?? rowCount;
  const columnStart = opts.dataRect?.columnStart ?? 0;
  const columnEnd = opts.dataRect?.columnEnd ?? s.columnsVisible.peek().length;

  const rows = s.internal.rowBackingDataSource.peek().rowGetMany(rowStart, rowEnd);

  const handleCsv = (rows: Record<number, RowNodeCore<D>>) => {
    const { data, groupHeaders, header } = getDataRect({
      rows,
      api,
      columnStart,
      columnEnd,
      uniformGroupHeaders: opts.uniformGroupHeaders,
    });

    const final = [...data];

    if (opts.includeHeader) final.unshift(header);
    if (opts.includeGroupHeaders) final.unshift(...groupHeaders);

    return final
      .map((c) => {
        return c.map((x) => `"${x}"`).join(opts.delimiter ?? ",");
      })
      .join("\n");
  };

  if ("then" in rows) {
    return rows.then((rows) => {
      return handleCsv(rows);
    });
  }

  return handleCsv(rows);
};

export const exportCsvFile = async <D, E>(
  api: ApiPro<D, E> | ApiCore<D, E>,
  opts: ExportCsvOptionsCore<D, E> = {},
) => {
  const csv = await api.exportCsv(opts as any);

  const blob = new Blob([csv], { type: "text/csv" });

  return blob;
};
