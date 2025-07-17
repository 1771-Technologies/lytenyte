import type { FunctionType, InterfaceType } from "../+types";

export const DataRect: InterfaceType = {
  kind: "interface",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  name: "DataRect",
  properties: [
    {
      kind: "property",
      name: "rowStart",
      optional: false,
      value: "number",
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "rowEnd",
      optional: false,
      value: "number",
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "columnStart",
      optional: false,
      value: "number",
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "columnEnd",
      optional: false,
      value: "number",
      tsDoc: ``,
      doc: { en: `` },
    },
  ],
};

export const ExportDataRectParams: InterfaceType = {
  kind: "interface",
  export: true,
  name: "ExportDataRectParams",
  doc: { en: `` },
  tsDoc: ``,
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      name: "dataRect",
      optional: true,
      tsDoc: ``,
      value: "DataRect",
    },
    {
      kind: "property",
      tsDoc: ``,
      doc: { en: `` },
      name: "uniformGroupHeaders",
      optional: true,
      value: "boolean",
    },
  ],
};

export const ExportDataRectResult: InterfaceType = {
  kind: "interface",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  name: "ExportDataRectResult<T>",
  properties: [
    {
      kind: "property",
      name: "headers",
      value: "string[]",
      optional: false,
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "groupHeaders",
      value: "(string | null)[][]",
      optional: false,
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "data",
      value: "unknown[][]",
      optional: false,
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "columns",
      value: "Column<T>[]",
      optional: false,
      tsDoc: ``,
      doc: { en: `` },
    },
  ],
};

export const ExportDataRectFn: FunctionType = {
  kind: "function",
  doc: { en: `` },
  tsDoc: ``,
  export: true,
  name: "ExportDataRectFn<T>",
  return: "ExportDataRectResult<T>",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      name: "params",
      optional: true,
      tsDoc: ``,
      value: "ExportDataRectParams",
    },
  ],
};

export const ExportCsvParams: InterfaceType = {
  kind: "interface",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  name: "ExportCsvParams",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "includeHeader",
      optional: true,
      value: "boolean",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "includeGroupHeaders",
      optional: true,
      value: "boolean",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "uniformGroupHeaders",
      optional: true,
      value: "boolean",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "delimiter",
      optional: true,
      value: "string",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "dataRect",
      optional: true,
      value: "DataRect",
    },
  ],
};
