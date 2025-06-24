import type { InterfaceType, InterfaceTypePartial, PropertyType, UnionType } from "../+types";

const HeaderBase: InterfaceTypePartial = {
  kind: "interface-partial",
  properties: [
    {
      kind: "property",
      name: "rowStart",
      value: "number",
      optional: false,
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "rowEnd",
      value: "number",
      optional: false,
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "rowSpan",
      value: "number",
      optional: false,
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "colStart",
      value: "number",
      optional: false,
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "colEnd",
      value: "number",
      optional: false,
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "colSpan",
      value: "number",
      optional: false,
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "colPin",
      optional: false,
      value: "ColumnPin",
      tsDoc: ``,
      doc: { en: `` },
    },
  ],
};

export const HeaderCell: InterfaceType = {
  kind: "interface",
  name: "HeaderCellLayout<T>",
  export: true,
  extends: HeaderBase,
  tsDoc: ``,
  doc: { en: `` },
  properties: [
    {
      kind: "property",
      name: "kind",
      value: '"cell"',
      optional: false,
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "column",
      value: "Column<T>",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
  ],
};

export const HeaderGroupCell: InterfaceType = {
  kind: "interface",
  name: "HeaderGroupCellLayout",
  export: true,
  extends: HeaderBase,
  tsDoc: ``,
  doc: { en: `` },
  properties: [
    {
      kind: "property",
      name: "kind",
      value: '"group"',
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "isCollapsible",
      value: "boolean",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "id",
      value: "string",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "idOccurrence",
      value: "string",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "groupPath",
      value: "string[]",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "columnIds",
      value: "string[]",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "start",
      value: "number",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "end",
      value: "number",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
  ],
};

export const HeaderLayoutCell: UnionType = {
  kind: "union",
  name: "HeaderLayoutCell<T>",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  types: ["HeaderCellLayout<T>", "HeaderGroupCellLayout"],
};

export const HeaderLayout: InterfaceType = {
  kind: "interface",
  name: "HeaderLayout<T>",
  export: true,
  doc: { en: `` },
  tsDoc: ``,
  properties: [
    {
      kind: "property",
      name: "maxRow",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "number",
    },
    {
      kind: "property",
      name: "maxCol",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "number",
    },
    {
      kind: "property",
      name: "layout",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "HeaderLayoutCell<T>[][]",
    },
  ],
};

const RowIndex: PropertyType = {
  kind: "property",
  name: "rowIndex",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "number",
};

export const RowFullWidthRowLayout: InterfaceType = {
  kind: "interface",
  name: "RowFullWidthRowLayout",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    RowIndex,
    {
      kind: "property",
      name: "kind",
      value: '"full-width"',
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "rowPin",
      value: "RowPin",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
  ],
};

export const RowCellLayout: InterfaceType = {
  kind: "interface",
  name: "RowCellLayout",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "kind",
      value: '"cell"',
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
    RowIndex,
    {
      kind: "property",
      name: "colIndex",
      value: "number",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "colSpan",
      value: "number",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "rowSpan",
      value: "number",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "rowPin",
      value: "RowPin",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "colPin",
      value: "ColumnPin",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
  ],
};

export const RowNormalRowLayout: InterfaceType = {
  kind: "interface",
  name: "RowNormalRowLayout",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    RowIndex,
    {
      kind: "property",
      name: "kind",
      value: '"row"',
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "cells",
      value: "RowCellLayout[]",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "rowPin",
      value: "RowPin",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
  ],
};

export const RowLayout: UnionType = {
  kind: "union",
  name: "RowLayout",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  types: ["RowNormalRowLayout", "RowFullWidthRowLayout"],
};

export const RowSectionLayouts: InterfaceType = {
  kind: "interface",
  name: "RowSectionLayouts",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [
    {
      kind: "property",
      name: "top",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "RowLayout[]",
    },
    {
      kind: "property",
      name: "center",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "RowLayout[]",
    },
    {
      kind: "property",
      name: "bottom",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "RowLayout[]",
    },

    {
      kind: "property",
      name: "rowTopTotalHeight",
      value: "number",
      doc: { en: `` },
      tsDoc: ``,
      optional: false,
    },
    {
      kind: "property",
      name: "rowCenterTotalHeight",
      value: "number",
      doc: { en: `` },
      tsDoc: ``,
      optional: false,
    },
    {
      kind: "property",
      name: "rowBottomTotalHeight",
      value: "number",
      doc: { en: `` },
      tsDoc: ``,
      optional: false,
    },
  ],
};

export const GridView: InterfaceType = {
  kind: "interface",
  name: "GridView<T>",
  export: true,
  doc: { en: `` },
  tsDoc: ``,
  properties: [
    {
      kind: "property",
      name: "header",
      doc: { en: `` },
      tsDoc: ``,
      optional: false,
      value: "HeaderLayout<T>",
    },
    {
      kind: "property",
      name: "rows",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "RowSectionLayouts",
    },
  ],
};
