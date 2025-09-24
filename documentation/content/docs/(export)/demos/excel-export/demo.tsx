"use client";

import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column, ExportDataRectResult } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/sample-data/bank-data-smaller";
import type { Worksheet } from "exceljs";
import { useId } from "react";

type BankData = (typeof bankDataSmall)[number];
const columns: Column<BankData>[] = [
  { id: "age", type: "number" },
  { id: "job" },
  { id: "balance", type: "number" },
  { id: "education" },
  { id: "marital" },
  { id: "default" },
  { id: "housing" },
  { id: "loan" },
  { id: "contact" },
  { id: "day", type: "number" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome" },
  { id: "y" },
];

export default function ExcelExport() {
  const ds = useClientRowDataSource({
    data: bankDataSmall,
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
  });

  const view = grid.view.useValue();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="p-2">
        <button
          className="rounded border border-gray-600 bg-gray-900 px-2 text-white dark:text-black"
          onClick={async () => {
            const rect = await grid.api.exportDataRect();

            downloadBlob(await getExcelFile(rect), "data.xlsx");
          }}
        >
          Download Excel File
        </button>
      </div>
      <div className="lng-grid" style={{ height: 500 }}>
        <Grid.Root grid={grid}>
          <Grid.Viewport>
            <Grid.Header>
              {view.header.layout.map((row, i) => {
                return (
                  <Grid.HeaderRow key={i} headerRowIndex={i}>
                    {row.map((c) => {
                      if (c.kind === "group") return null;

                      return (
                        <Grid.HeaderCell
                          key={c.id}
                          cell={c}
                          className="flex h-full w-full items-center px-2 capitalize"
                        />
                      );
                    })}
                  </Grid.HeaderRow>
                );
              })}
            </Grid.Header>
            <Grid.RowsContainer>
              <Grid.RowsCenter>
                {view.rows.center.map((row) => {
                  if (row.kind === "full-width") return null;

                  return (
                    <Grid.Row row={row} key={row.id}>
                      {row.cells.map((c) => {
                        return (
                          <Grid.Cell
                            key={c.id}
                            cell={c}
                            className="flex h-full w-full items-center px-2 text-sm"
                          />
                        );
                      })}
                    </Grid.Row>
                  );
                })}
              </Grid.RowsCenter>
            </Grid.RowsContainer>
          </Grid.Viewport>
        </Grid.Root>
      </div>
    </div>
  );
}

function downloadBlob(blob: Blob, name: string) {
  // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
  const blobUrl = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement("a");

  // Set link's href to point to the Blob URL
  link.href = blobUrl;
  link.download = name;

  // Append link to the body
  document.body.appendChild(link);

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );

  // Remove link from body
  document.body.removeChild(link);
}

async function getExcelFile(d: ExportDataRectResult<BankData>) {
  const excelJs = await import("exceljs");
  const workbook = new excelJs.Workbook();

  workbook.creator = "1771 Technologies";
  workbook.lastModifiedBy = "1771 Technologies";

  // Set default options
  const {
    sheetName = "Data Export",
    headerBgColor = "4472C4", // Medium blue without # symbol
    headerFgColor = "FFFFFF", // White without # symbol
    alternateRowColors = true,
    evenRowBgColor = "F2F2F2", // Light gray without # symbol
    oddRowBgColor = "FFFFFF", // White without # symbol
  } = {};

  // Create a new workbook and worksheet
  workbook.creator = "ExcelJS Export";
  workbook.lastModifiedBy = "ExcelJS Export";
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet(sheetName);

  // Define columns
  worksheet.columns = d.columns.map((column, index) => ({
    header: d.headers[index] || column.name,
    key: index.toString(),
    width: Math.max(column.id!.length + 2, 12), // Dynamic width based on header name length
    style: {
      numFmt: column.type === "number" ? "#,##0.00" : "@", // Format numbers with 2 decimal places
    },
  }));

  // Add the data
  d.data.forEach((row) => {
    const rowData: Record<string, unknown> = {};
    row.forEach((cell, cellIndex) => {
      rowData[cellIndex.toString()] = cell;
    });
    worksheet.addRow(rowData);
  });

  // Style the header row
  const headerRow = worksheet.getRow(1);
  headerRow.height = 22;
  headerRow.font = {
    name: "Calibri",
    size: 11,
    bold: true,
    color: { argb: headerFgColor },
  };

  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: headerBgColor },
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
    };
  });

  // Apply alternate row colors for data rows
  if (alternateRowColors) {
    for (let i = 2; i <= worksheet.rowCount; i++) {
      const rowColor = i % 2 === 0 ? evenRowBgColor : oddRowBgColor;
      const row = worksheet.getRow(i);

      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: rowColor },
        };

        // Style borders
        cell.border = {
          top: { style: "thin", color: { argb: "D3D3D3" } },
          left: { style: "thin", color: { argb: "D3D3D3" } },
          bottom: { style: "thin", color: { argb: "D3D3D3" } },
          right: { style: "thin", color: { argb: "D3D3D3" } },
        };

        // Align cell content
        cell.alignment = {
          vertical: "middle",
          horizontal: cell.value !== null && typeof cell.value === "number" ? "right" : "left",
        };
      });
    }
  }

  // Apply auto-filters to the header row
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: d.headers.length },
  };

  // Freeze the top row
  worksheet.views = [{ state: "frozen", xSplit: 0, ySplit: 1, activeCell: "A2" }];

  d.columns.forEach((_, index) => {
    const columnWidth = estimateColumnWidth(worksheet, index);
    worksheet.getColumn(index + 1).width = columnWidth;
  });

  // Write to a buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Create a blob from the buffer
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  return blob;
}
function estimateColumnWidth(worksheet: Worksheet, columnIndex: number) {
  let maxWidth = 10; // Default minimum width

  // Check header width (adding extra space for padding)
  const headerCell = worksheet.getCell(1, columnIndex + 1);
  if (headerCell && headerCell.value) {
    const headerLength = String(headerCell.value).length;
    maxWidth = Math.max(maxWidth, headerLength + 4); // Add padding
  }

  // Check data cell widths
  worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
    if (rowNumber > 1) {
      // Skip header
      const cell = row.getCell(columnIndex + 1);
      if (cell && cell.value !== null && cell.value !== undefined) {
        let cellLength = String(cell.value).length;
        // Add extra width for numbers with formatting
        if (typeof cell.value === "number") {
          cellLength += 3; // Add extra space for formatting
        }
        maxWidth = Math.max(maxWidth, cellLength + 2); // Add padding
      }
    }
  });

  // Cap maximum width to prevent extremely wide columns
  return Math.min(maxWidth, 50);
}
