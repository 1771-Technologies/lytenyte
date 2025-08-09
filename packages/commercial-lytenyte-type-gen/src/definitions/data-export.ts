import type { FunctionType, InterfaceType } from "../+types";

export const DataRect: InterfaceType = {
  kind: "interface",
  tsDoc: `
  Represents a rectangular selection of cells in LyteNyte Grid.

  A DataRect defines its range by numerical row and column indices. It is used to extract 
  or operate on a subset of the grid's data regardless of row or column reordering. However, 
  if the number of rows or columns changes, the rect may be invalidated if it extends 
  beyond the new bounds.

  @group Export
  `,
  doc: { en: `` },
  export: true,
  name: "DataRect",
  properties: [
    {
      kind: "property",
      name: "rowStart",
      optional: false,
      value: "number",
      tsDoc: `The starting row index (inclusive).`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "rowEnd",
      optional: false,
      value: "number",
      tsDoc: `The ending row index (exclusive).`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "columnStart",
      optional: false,
      value: "number",
      tsDoc: `The starting column index (inclusive).`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "columnEnd",
      optional: false,
      value: "number",
      tsDoc: `The ending column index (exclusive).`,
      doc: { en: `` },
    },
  ],
};

export const ExportDataRectParams: InterfaceType = {
  kind: "interface",
  export: true,
  name: "ExportDataRectParams",
  doc: { en: `` },
  tsDoc: `
  Parameters for exporting a specific rectangular region of the grid using a DataRect.

  @group Export
  `,
  properties: [
    {
      kind: "property",
      name: "dataRect",
      optional: true,
      value: "DataRect",
      tsDoc: `The specific DataRect to export. If omitted, the grid may default to a visible range.`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "uniformGroupHeaders",
      optional: true,
      value: "boolean",
      tsDoc: `
      Whether group headers should be returned as symmetrical arrays (i.e., uniform across rows).

      Useful when dealing with column groups that span multiple columns.
      `,
      doc: { en: `` },
    },
  ],
};

export const ExportDataRectResult: InterfaceType = {
  kind: "interface",
  tsDoc: `
  The result structure returned after exporting a DataRect from LyteNyte Grid.

  @group Export
  `,
  doc: { en: `` },
  export: true,
  name: "ExportDataRectResult<T>",
  properties: [
    {
      kind: "property",
      name: "headers",
      value: "string[]",
      optional: false,
      tsDoc: `An array of header ids for the exported columns.`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "groupHeaders",
      value: "(string | null)[][]",
      optional: false,
      tsDoc: `A matrix of group header labels corresponding to the exported columns.`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "data",
      value: "unknown[][]",
      optional: false,
      tsDoc: `The 2D data matrix for the selected cells. Row and column spans are not applied.`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "columns",
      value: "Column<T>[]",
      optional: false,
      tsDoc: `The column definitions associated with the exported data.`,
      doc: { en: `` },
    },
  ],
};

export const ExportDataRectFn: FunctionType = {
  kind: "function",
  doc: { en: `` },
  tsDoc: `
  Signature for the function that exports a DataRect from the grid.

  Called via the LyteNyte Grid API when exporting a selection of cells.

  @group Export
  `,
  export: true,
  name: "ExportDataRectFn<T>",
  return: "Promise<ExportDataRectResult<T>>",
  properties: [
    {
      kind: "property",
      name: "params",
      optional: true,
      value: "ExportDataRectParams",
      tsDoc: `Optional parameters for exporting a DataRect.`,
      doc: { en: `` },
    },
  ],
};

export const ExportCsvParams: InterfaceType = {
  kind: "interface",
  tsDoc: `
  Parameters for exporting a CSV file from LyteNyte Grid.

  @group Export
  `,
  doc: { en: `` },
  export: true,
  name: "ExportCsvParams",
  properties: [
    {
      kind: "property",
      name: "includeHeader",
      optional: true,
      value: "boolean",
      tsDoc: `Whether to include column headers in the CSV output.`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "includeGroupHeaders",
      optional: true,
      value: "boolean",
      tsDoc: `Whether to include column group headers in the CSV output.`,
      doc: {
        en: `A boolean indicating if the group headers should be included in the CSV result.`,
      },
    },
    {
      kind: "property",
      name: "uniformGroupHeaders",
      optional: true,
      value: "boolean",
      tsDoc: `Whether group headers should be rendered as uniform-length arrays.`,
      doc: {
        en: `A boolean indicating if the group headers should be a symmetrical array in the CSV result.`,
      },
    },
    {
      kind: "property",
      name: "delimiter",
      optional: true,
      value: "string",
      tsDoc: `Delimiter character to use for separating values in the CSV output.`,
      doc: {
        en: `A delimiter to use for the CSV separator`,
      },
    },
    {
      kind: "property",
      name: "dataRect",
      optional: true,
      value: "DataRect",
      tsDoc: `
      Optional DataRect specifying the area to export.

      If not provided, the grid exports the currently visible data range.
      `,
      doc: {
        en: `The data rect to export to CSV. If not provided a rect that encompasses the current grid view will be used instead.`,
      },
    },
  ],
};
