import type { InterfaceType, UnionType } from "../+types";
import { ColumnIndexProp, RowIndexProp } from "./shared-properties";

export const PositionGridCellRoot: InterfaceType = {
  kind: "interface",
  name: "PositionGridCellRoot",
  tsDoc: ``,
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
      tsDoc: ``,
      value: "number",
    },
    {
      kind: "property",
      name: "colSpan",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      value: "number",
    },
  ],
};

export const PositionGridCell: InterfaceType = {
  kind: "interface",
  name: "PositionGridCell",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
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
      tsDoc: ``,
      value: "PositionGridCellRoot | null",
    },
  ],
};

export const PositionFullWidthRow: InterfaceType = {
  kind: "interface",
  name: "PositionFullWidthRow",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
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
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      tsDoc: ``,
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
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      tsDoc: ``,
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
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      tsDoc: ``,
      doc: { en: `` },
      name: "kind",
      optional: false,
      value: '"header-group-cell"',
    },
    {
      kind: "property",
      tsDoc: ``,
      doc: { en: `` },
      name: "columnStartIndex",
      optional: false,
      value: "number",
    },
    {
      kind: "property",
      tsDoc: ``,
      doc: { en: `` },
      name: "columnEndIndex",
      optional: false,
      value: "number",
    },
    {
      kind: "property",
      tsDoc: ``,
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
  tsDoc: ``,
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
