import type { InterfaceType, UnionType } from "../+types";
import { ColumnIndexProp, RowIndexProp } from "./shared-properties";

export const PositionGridCellRoot: InterfaceType = {
  kind: "interface",
  name: "PositionGridCellRoot",
  tsDoc: `The root reference of a grid cell. If a cell is obscured by a rowspan 
  or colspan, it points to the actual root cell containing the data.`,
  doc: { en: `` },
  export: true,
  properties: [
    ColumnIndexProp,
    RowIndexProp,
    {
      kind: "property",
      name: "rowSpan",
      doc: { en: `` },
      optional: false,
      tsDoc: `The number of rows spanned by the root cell.`,
      value: "number",
    },
    {
      kind: "property",
      name: "colSpan",
      doc: { en: `` },
      optional: false,
      tsDoc: `The number of columns spanned by the root cell.`,
      value: "number",
    },
  ],
};

export const PositionGridCell: InterfaceType = {
  kind: "interface",
  name: "PositionGridCell",
  tsDoc: `Represents the current focus position of a regular cell in the grid.`,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Discriminant for identifying this as a regular grid cell position.`,
      name: "kind",
      value: '"cell"',
      optional: false,
    },
    RowIndexProp,
    ColumnIndexProp,
    {
      kind: "property",
      doc: { en: `` },
      name: "root",
      optional: false,
      tsDoc: `Reference to the root cell. If \`null\`, this cell is not hidden by spanning and is its own root.`,
      value: "PositionGridCellRoot | null",
    },
  ],
};

export const PositionFullWidthRow: InterfaceType = {
  kind: "interface",
  name: "PositionFullWidthRow",
  tsDoc: `Describes the focus position when a full width row is active.`,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Discriminant indicating this position refers to a full width row.`,
      name: "kind",
      value: '"full-width"',
      optional: false,
    },
    RowIndexProp,
    ColumnIndexProp,
  ],
};

export const PositionHeaderCell: InterfaceType = {
  kind: "interface",
  name: "PositionHeaderCell",
  tsDoc: `Describes the focus position of a standard header cell.`,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      tsDoc: `Discriminant for identifying this as a header cell position.`,
      doc: { en: `` },
      name: "kind",
      optional: false,
      value: '"header-cell"',
    },
    ColumnIndexProp,
  ],
};

export const PositionFloatingCell: InterfaceType = {
  kind: "interface",
  name: "PositionFloatingCell",
  tsDoc: `Describes the focus position of a floating header cell.`,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      tsDoc: `Discriminant for identifying this as a floating header cell.`,
      doc: { en: `` },
      name: "kind",
      optional: false,
      value: '"floating-cell"',
    },
    ColumnIndexProp,
  ],
};

export const PositionHeaderGroupCell: InterfaceType = {
  kind: "interface",
  name: "PositionHeaderGroupCell",
  tsDoc: `Describes the focus position of a header group cell in the column hierarchy.`,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      tsDoc: `Discriminant indicating this is a header group cell.`,
      doc: { en: `` },
      name: "kind",
      optional: false,
      value: '"header-group-cell"',
    },
    {
      kind: "property",
      tsDoc: `The inclusive start index of the group column range.`,
      doc: { en: `` },
      name: "columnStartIndex",
      optional: false,
      value: "number",
    },
    {
      kind: "property",
      tsDoc: `The exclusive end index of the group column range.`,
      doc: { en: `` },
      name: "columnEndIndex",
      optional: false,
      value: "number",
    },
    {
      kind: "property",
      tsDoc: `The header hierarchy row index of the group.`,
      doc: { en: `` },
      name: "hierarchyRowIndex",
      optional: false,
      value: "number",
    },
    ColumnIndexProp,
  ],
};

export const PositionUnion: UnionType = {
  kind: "union",
  name: "PositionUnion",
  tsDoc: `Union of all valid focusable positions in the grid: cells, headers, full width rows, etc.`,
  doc: { en: `` },
  export: true,
  types: [
    "PositionGridCell",
    "PositionFloatingCell",
    "PositionHeaderCell",
    "PositionFullWidthRow",
    "PositionHeaderGroupCell",
  ],
};
