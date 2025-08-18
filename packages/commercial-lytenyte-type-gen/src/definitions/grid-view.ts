import type { InterfaceType, InterfaceTypePartial, PropertyType, UnionType } from "../+types";
import {
  ColPinProp,
  ColumnIndexProp,
  ColumnProp,
  IdProp,
  RowIndexProp,
  RowNodeAtomProp,
  RowPinProp,
} from "./shared-properties";

const CellLastStartPinProp: PropertyType = {
  kind: "property",
  name: "colLastStartPin",
  optional: true,
  value: "boolean",
  tsDoc: `True if this column is the last column in the set of columns pinned to the start.`,
  doc: { en: `` },
};

const CellFirstEndPinProp: PropertyType = {
  kind: "property",
  name: "colFirstEndPin",
  optional: true,
  value: "boolean",
  tsDoc: `True if this column is the first column in the set of columns pinned to the end.`,
  doc: { en: `` },
};

const RowLastPinTopProp: PropertyType = {
  kind: "property",
  name: "rowLastPinTop",
  optional: true,
  value: "boolean",
  tsDoc: `True if this row is the last row pinned to the top of the grid.`,
  doc: { en: `` },
};

const RowFirstPinBottomProp: PropertyType = {
  kind: "property",
  name: "rowFirstPinBottom",
  optional: true,
  value: "boolean",
  tsDoc: `True if this row is the first row pinned to the bottom of the grid.`,
  doc: { en: `` },
};

const RowIsFocusRow: PropertyType = {
  kind: "property",
  name: "rowIsFocusRow",
  optional: true,
  value: "boolean",
  tsDoc: `True if this row contains the currently focused cell and should be included in layout calculation.`,
  doc: { en: `` },
};

const HeaderBase: InterfaceTypePartial = {
  kind: "interface-partial",
  properties: [
    {
      kind: "property",
      name: "rowStart",
      value: "number",
      optional: false,
      tsDoc: `The starting row index in the header hierarchy for this cell.`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "rowEnd",
      value: "number",
      optional: false,
      tsDoc: `The exclusive ending row index in the header hierarchy for this cell.`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "rowSpan",
      value: "number",
      optional: false,
      tsDoc: `The number of header rows this header spans vertically.`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "colStart",
      value: "number",
      optional: false,
      tsDoc: `The starting column index in the visible layout this header covers.`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "colEnd",
      value: "number",
      optional: false,
      tsDoc: `The exclusive ending column index in the visible layout this header covers.`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "colSpan",
      value: "number",
      optional: false,
      tsDoc: `The number of columns this header spans horizontally.`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "colPin",
      optional: false,
      value: "ColumnPin",
      tsDoc: `Indicates which pin section this column belongs to: 'start', 'end', or 'center'.`,
      doc: { en: `` },
    },
    CellFirstEndPinProp,
    CellLastStartPinProp,
  ],
};

export const HeaderCell: InterfaceType = {
  kind: "interface",
  name: "HeaderCellLayout<T>",
  export: true,
  extends: HeaderBase,
  tsDoc: `Describes a standard header cell layout in the grid, used to position and render individual column headers.
  
  @group Grid View
  `,
  doc: { en: `` },
  properties: [
    IdProp,
    {
      kind: "property",
      name: "kind",
      value: '"cell"',
      optional: false,
      tsDoc: `A discriminator indicating this is a standard header cell.`,
      doc: { en: `` },
    },
    ColumnProp,
  ],
};

export const HeaderCellFloating: InterfaceType = {
  kind: "interface",
  name: "HeaderCellFloating<T>",
  export: true,
  extends: HeaderBase,
  tsDoc: `Describes a floating header cell layout, which remains fixed during scroll operations.
  
  @group Grid View
  `,
  doc: { en: `` },
  properties: [
    IdProp,
    {
      kind: "property",
      name: "kind",
      value: '"floating"',
      optional: false,
      tsDoc: `A discriminator indicating this is a floating (sticky) header cell.`,
      doc: { en: `` },
    },
    ColumnProp,
  ],
};

export const HeaderGroupCell: InterfaceType = {
  kind: "interface",
  name: "HeaderGroupCellLayout",
  export: true,
  extends: HeaderBase,
  tsDoc: `Describes a group of columns within the header. Used by LyteNyte 
  Grid to render grouped column headers with optional collapsibility and structural metadata.
  
  @group Grid View
  `,
  doc: { en: `` },
  properties: [
    {
      kind: "property",
      name: "kind",
      value: '"group"',
      tsDoc: `Discriminant indicating this layout item is a header group.`,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "isCollapsible",
      value: "boolean",
      tsDoc: `Indicates whether this column group can be collapsed in the UI.`,
      doc: { en: `` },
      optional: false,
    },
    {
      ...IdProp,
      tsDoc: `The id for the header group. Note this is not unique across all header groups. In particular
      split header groups with the same path will share the same id. Prefer \`idOccurrence\` for unique keys.`,
    },
    {
      kind: "property",
      name: "idOccurrence",
      value: "string",
      tsDoc: `Unique identifier that includes header split occurrence information.`,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "groupPath",
      value: "string[]",
      tsDoc: `Hierarchy path representing this column group's position and ancestry.`,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "columnIds",
      value: "string[]",
      tsDoc: `Column ids that are included within this header group.`,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "start",
      value: "number",
      tsDoc: `Start index of the group in the column layout.`,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "end",
      value: "number",
      tsDoc: `Exclusive end index of the group in the column layout.`,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "isHiddenMove",
      value: "boolean",
      tsDoc: `Indicates that this is a temporary placeholder group for drag-and-drop movement. 
      Should be ignored for typical rendering.`,
      doc: { en: `` },
      optional: true,
    },
  ],
};

export const HeaderLayoutCell: UnionType = {
  kind: "union",
  name: "HeaderLayoutCell<T>",
  export: true,
  tsDoc: `Represents a union of all possible header layout cell types: 
  normal header, floating header, or header group.
  
  @group Grid View
  `,
  doc: { en: `` },
  types: ["HeaderCellLayout<T>", "HeaderCellFloating<T>", "HeaderGroupCellLayout"],
};

export const HeaderLayout: InterfaceType = {
  kind: "interface",
  name: "HeaderLayout<T>",
  export: true,
  doc: { en: `` },
  tsDoc: `Defines the overall structure of header rows in the grid. 
  This layout is recalculated based on viewport changes and virtualized rendering.
  
  @group Grid View
  `,
  properties: [
    {
      kind: "property",
      name: "maxRow",
      tsDoc: `Total number of header rows rendered, including groups and nested headers.`,
      doc: { en: `` },
      optional: false,
      value: "number",
    },
    {
      kind: "property",
      name: "maxCol",
      tsDoc: `Total number of columns involved in the header layout.`,
      doc: { en: `` },
      optional: false,
      value: "number",
    },
    {
      kind: "property",
      name: "layout",
      tsDoc: `Two-dimensional array of header layout cells organized by row hierarchy.`,
      doc: { en: `` },
      optional: false,
      value: "HeaderLayoutCell<T>[][]",
    },
  ],
};

export const RowFullWidthRowLayout: InterfaceType = {
  kind: "interface",
  name: "RowFullWidthRowLayout<T>",
  tsDoc: `Describes the layout of a full-width row which spans all columns. 
  These are typically used for summary or group rows.
  
  @group Grid View
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "kind",
      value: '"full-width"',
      tsDoc: `Discriminator for identifying full-width row layout objects.`,
      doc: { en: `` },
      optional: false,
    },
    IdProp,
    RowIndexProp,
    RowNodeAtomProp,
    RowPinProp,
    RowLastPinTopProp,
    RowFirstPinBottomProp,
    RowIsFocusRow,
  ],
};

export const RowCellLayout: InterfaceType = {
  kind: "interface",
  name: "RowCellLayout<T>",
  tsDoc: `Represents the layout metadata for a single cell within a row, including span and contextual info.
  
  @group Grid View
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "kind",
      value: '"cell"',
      tsDoc: `Discriminator to identify a standard cell layout object.`,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "colSpan",
      value: "number",
      tsDoc: `Number of columns this cell spans across.`,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "rowSpan",
      value: "number",
      tsDoc: `Number of rows this cell spans across.`,
      doc: { en: `` },
      optional: false,
    },
    IdProp,
    RowIndexProp,
    ColumnIndexProp,
    RowNodeAtomProp,
    ColumnProp,
    ColPinProp,
    RowPinProp,
    CellFirstEndPinProp,
    CellLastStartPinProp,
    RowLastPinTopProp,
    RowFirstPinBottomProp,
    RowIsFocusRow,
  ],
};

export const RowNormalRowLayout: InterfaceType = {
  kind: "interface",
  name: "RowNormalRowLayout<T>",
  tsDoc: `Describes the layout of a standard row in LyteNyte Grid, 
  including cell arrangement and row-level metadata.
  
  @group Grid View
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "kind",
      value: '"row"',
      tsDoc: `Discriminator identifying this layout as a normal row.`,
      doc: { en: `` },
      optional: false,
    },
    RowIndexProp,
    RowNodeAtomProp,
    RowPinProp,
    RowLastPinTopProp,
    RowFirstPinBottomProp,
    RowIsFocusRow,
    IdProp,
    {
      kind: "property",
      name: "cells",
      value: "RowCellLayout<T>[]",
      tsDoc: `List of cell layout metadata for this row.`,
      doc: { en: `` },
      optional: false,
    },
  ],
};

export const RowLayout: UnionType = {
  kind: "union",
  name: "RowLayout<T>",
  export: true,
  tsDoc: `A row layout is either a standard row or a full-width row, depending on its content and configuration.
  
  @group Grid View
  `,
  doc: { en: `` },
  types: ["RowNormalRowLayout<T>", "RowFullWidthRowLayout<T>"],
};

export const RowSectionLayouts: InterfaceType = {
  kind: "interface",
  name: "RowSectionLayouts<T>",
  export: true,
  tsDoc: `Organizes the rows into three separate sections: top (pinned), center (scrollable), 
  and bottom (pinned). Used to optimize row virtualization and rendering.
  
  @group Grid View
  `,
  doc: { en: `` },
  properties: [
    {
      kind: "property",
      name: "top",
      tsDoc: `Layout information for pinned rows at the top of the grid.`,
      doc: { en: `` },
      optional: false,
      value: "RowLayout<T>[]",
    },
    {
      kind: "property",
      name: "center",
      tsDoc: `Layout information for scrollable rows in the grid.`,
      doc: { en: `` },
      optional: false,
      value: "RowLayout<T>[]",
    },
    {
      kind: "property",
      name: "bottom",
      tsDoc: `Layout information for pinned rows at the bottom of the grid.`,
      doc: { en: `` },
      optional: false,
      value: "RowLayout<T>[]",
    },
    {
      kind: "property",
      name: "rowTopTotalHeight",
      value: "number",
      doc: { en: `` },
      tsDoc: `Cumulative height of all top-pinned rows in pixels.`,
      optional: false,
    },
    {
      kind: "property",
      name: "rowCenterTotalHeight",
      value: "number",
      doc: { en: `` },
      tsDoc: `Cumulative height of all scrollable center rows in pixels.`,
      optional: false,
    },
    {
      kind: "property",
      name: "rowBottomTotalHeight",
      value: "number",
      doc: { en: `` },
      tsDoc: `Cumulative height of all bottom-pinned rows in pixels.`,
      optional: false,
    },
    {
      kind: "property",
      name: "rowFocusedIndex",
      value: "number | null",
      doc: { en: `` },
      tsDoc: `Index of the currently focused row, if it exists. Focused rows may 
      appear in the layout even if not otherwise visible.`,
      optional: false,
    },
    {
      kind: "property",
      name: "rowFirstCenter",
      value: "number",
      doc: { en: `` },
      tsDoc: `Index of the first center (scrollable) row.`,
      optional: false,
    },
  ],
};

export const GridView: InterfaceType = {
  kind: "interface",
  name: "GridView<T>",
  export: true,
  doc: { en: `` },
  tsDoc: `Represents the current visual layout of the grid including headers and rows. 
  This structure is used by LyteNyte Grid headless components 
  or for building custom visualizations.
  
  @group Grid View
  `,
  properties: [
    {
      kind: "property",
      name: "header",
      doc: { en: `` },
      tsDoc: `Header layout structure currently being rendered in the viewport.`,
      optional: false,
      value: "HeaderLayout<T>",
    },
    {
      kind: "property",
      name: "rows",
      tsDoc: `Row layout sections (top, center, bottom) rendered in the viewport.`,
      doc: { en: `` },
      optional: false,
      value: "RowSectionLayouts<T>",
    },
  ],
};
