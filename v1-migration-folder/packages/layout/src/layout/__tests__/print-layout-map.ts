import type { LayoutMap } from "../../+types.layout";
import { FULL_WIDTH_MAP } from "../../+constants.layout";
import { Table } from "@1771technologies/cli-table";

export function printLayoutMap(l: LayoutMap) {
  const rows = [...l.entries()].sort((l, r) => l[0] - r[0]);

  const columnIndices = [
    ...new Set(
      rows.flatMap((c) => {
        return [...c[1].keys()];
      }),
    ),
  ].sort((l, r) => l - r);

  const max = Math.max(...columnIndices);

  const table = new Table({});
  table.push(["Row ", ...Array.from({ length: max + 1 }, (_, i) => i)]);

  for (let i = 0; i < rows.length; i++) {
    const [rowIndex, row] = rows[i];

    const tableRow = Array.from({ length: max + 1 }, (_) => "-") as (string | number)[];
    tableRow[0] = rowIndex;

    if (row === FULL_WIDTH_MAP) {
      for (let i = 1; i <= max + 1; i++) tableRow[i] = "F";
    } else {
      row.entries().forEach((entry) => {
        const [colIndex, col] = entry;
        const [x, y, z] = col as number[];

        if (x === 0) tableRow[colIndex + 1] = `#r${y},${z}`;
        else if (x > 1 || y > 1) tableRow[colIndex + 1] = `c${x},${y}`;
        else tableRow[colIndex + 1] = `${x},${y}`;
      });
    }

    table.push(tableRow);
  }

  return table.toString();
}
