import type { CellRendererParams } from "@1771technologies/lytenyte-pro/types";
import type { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";

export type BankData = (typeof bankDataSmall)[number];

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});
export function BalanceCell({ grid, row, column }: CellRendererParams<BankData>) {
  const field = grid.api.columnField(column, row);

  if (typeof field === "number") {
    if (field < 0) return `-$${formatter.format(Math.abs(field))}`;

    return "$" + formatter.format(field);
  }

  return `${field ?? "-"}`;
}
export function DurationCell({ grid, row, column }: CellRendererParams<BankData>) {
  const field = grid.api.columnField(column, row);

  return typeof field === "number" ? `${formatter.format(field)} days` : `${field ?? "-"}`;
}

export function NumberCell({ grid, row, column }: CellRendererParams<BankData>) {
  const field = grid.api.columnField(column, row);

  return typeof field === "number" ? formatter.format(field) : `${field ?? "-"}`;
}
