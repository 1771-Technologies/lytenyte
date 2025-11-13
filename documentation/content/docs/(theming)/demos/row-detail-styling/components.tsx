import type { CellRendererParams } from "@1771technologies/lytenyte-pro/types";
import type { companiesWithPricePerf } from "@1771technologies/sample-data/companies-with-price-performance";

type PerformanceData = (typeof companiesWithPricePerf)[number];

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});
export function PriceCell({ grid, row, column }: CellRendererParams<PerformanceData>) {
  const field = grid.api.columnField(column, row);

  if (typeof field === "number") {
    if (field < 0) return `-$${formatter.format(Math.abs(field))}`;

    return "$" + formatter.format(field);
  }

  return `${field ?? "-"}`;
}

export function NumberCell({ grid, row, column }: CellRendererParams<PerformanceData>) {
  const field = grid.api.columnField(column, row);

  return typeof field === "number" ? formatter.format(field) : `${field ?? "-"}`;
}
