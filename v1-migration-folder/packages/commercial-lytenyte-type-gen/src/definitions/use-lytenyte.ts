import type { InterfaceType, PropertyType } from "../+types.js";

const Columns: PropertyType = {
  kind: "property",
  name: "columns",
  optional: true,
  value: "Column[]",
  tsDoc: ``,
  doc: { en: `` },
};

const ColumnBase: PropertyType = {
  kind: "property",
  name: "columnBase",
  optional: true,
  value: "ColumnBase",
  tsDoc: ``,
  doc: { en: `` },
};

const HeaderHeight: PropertyType = {
  kind: "property",
  name: "headerHeight",
  optional: true,
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
};
const HeaderGroupHeight: PropertyType = {
  kind: "property",
  name: "headerGroupHeight",
  optional: true,
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
};

const GridId: PropertyType = {
  kind: "property",
  name: "gridId",
  optional: false,
  value: "string",
  tsDoc: ``,
  doc: { en: `` },
};

const ColumnSizeToFit: PropertyType = {
  kind: "property",
  name: "columnSizeToFit",
  optional: true,
  value: "boolean",
  tsDoc: ``,
  doc: { en: `` },
};

const ColumnGroupExpansions: PropertyType = {
  kind: "property",
  name: "columnGroupExpansions",
  optional: true,
  value: "Record<string, boolean>",
  tsDoc: ``,
  doc: { en: `` },
};
const ColumnGroupDefaultExpansion: PropertyType = {
  kind: "property",
  name: "columnGroupDefaultExpansion",
  optional: true,
  value: "boolean",
  tsDoc: ``,
  doc: { en: `` },
};
const ColumnGroupJoinDelimiter: PropertyType = {
  kind: "property",
  name: "columnGroupJoinDelimiter",
  optional: true,
  value: "string",
  tsDoc: ``,
  doc: { en: `` },
};

const RowDataSource: PropertyType = {
  kind: "property",
  name: "rowDataSource",
  optional: true,
  value: "RowDataSource<T>",
  tsDoc: ``,
  doc: { en: `` },
};

const RowAutoHeightGuess: PropertyType = {
  kind: "property",
  name: "rowAutoHeightGuess",
  optional: true,
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
};
const RowAutoHeightCache: PropertyType = {
  kind: "property",
  name: "rowAutoHeightCache",
  optional: true,
  value: "Record<number, number>",
  tsDoc: ``,
  doc: { en: `` },
};
const RowHeight: PropertyType = {
  kind: "property",
  name: "rowHeight",
  optional: true,
  value: "RowHeight",
  doc: { en: `` },
  tsDoc: ``,
};

const RowScanDistance: PropertyType = {
  kind: "property",
  name: "rowScanDistance",
  optional: true,
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
};
const ColScanDistance: PropertyType = {
  kind: "property",
  name: "colScanDistance",
  optional: true,
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
};

const RowOverscanTop: PropertyType = {
  kind: "property",
  name: "rowOverscanTop",
  optional: true,
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
};
const RowOverscanBottom: PropertyType = {
  kind: "property",
  name: "rowOverscanBottom",
  optional: true,
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
};
const ColOverscanStart: PropertyType = {
  kind: "property",
  name: "colOverscanStart",
  optional: true,
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
};
const ColOverscanEnd: PropertyType = {
  kind: "property",
  name: "colOverscanEnd",
  optional: true,
  value: "number",
  tsDoc: ``,
  doc: { en: `` },
};

export const UseLyteNytePropsCore: InterfaceType = {
  kind: "interface",
  name: "UseLyteNyteProps<T>",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  tag: "core",
  properties: [
    Columns,
    ColumnBase,
    ColumnGroupDefaultExpansion,
    ColumnGroupExpansions,
    ColumnGroupJoinDelimiter,
    ColumnSizeToFit,
    HeaderHeight,
    HeaderGroupHeight,
    GridId,
    RowDataSource,
    RowAutoHeightCache,
    RowAutoHeightGuess,
    RowHeight,
    ColScanDistance,
    RowScanDistance,
    RowOverscanTop,
    RowOverscanBottom,
    ColOverscanStart,
    ColOverscanEnd,
  ],
};
