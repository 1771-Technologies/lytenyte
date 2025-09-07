import { Table } from "@1771technologies/cli-table";
import type { GridView } from "../../../+types";

export function printView(v: GridView<any>["header"]) {
  const table = new Table();

  const data: string[][] = Array.from({ length: v.maxRow }, () => {
    return Array.from({ length: v.maxCol }, () => "");
  });

  v.layout.forEach((row) => {
    row.forEach((d) => {
      for (let r = d.rowStart; r < d.rowStart + d.rowSpan; r++) {
        for (let c = d.colStart; c < d.colStart + d.colSpan; c++) {
          if (d.kind === "group") {
            data[r][c] = `${d.idOccurrence}`;
          } else {
            data[r][c] = `${d.column.id}`;
          }
        }
      }
    });
  });

  table.push(...data);

  return `Row: ${v.maxRow}, Col: ${v.maxCol}\n${table.toString()}`;
}
