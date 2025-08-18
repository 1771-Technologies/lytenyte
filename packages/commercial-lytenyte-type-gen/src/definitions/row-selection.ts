import type { InterfaceType, UnionType } from "../+types";

export const RowSelectionMode: UnionType = {
  kind: "union",
  name: "RowSelectionMode",
  tsDoc: `Specifies the available row selection modes supported by LyteNyte Grid. 
  - "single" allows only one row to be selected at a time.
  - "multiple" allows multiple row selections.
  - "none" disables row selection entirely.
  
  @group Row Selection
  `,
  doc: { en: `` },
  export: true,
  types: ['"single"', '"multiple"', '"none"'],
};

export const RowSelectionActivator: UnionType = {
  kind: "union",
  name: "RowSelectionActivator",
  tsDoc: `Defines the interaction behavior that activates row selection.
  - "single-click" selects a row with a single mouse click.
  - "double-click" requires a double-click to select.
  - "none" disables interaction-based row selection.
  
  @group Row Selection
  `,
  doc: { en: `` },
  export: true,
  types: ['"single-click"', '"double-click"', '"none"'],
};

export const RowSelectOptions: InterfaceType = {
  kind: "interface",
  name: "RowSelectOptions",
  tsDoc: `
  Configuration options used when performing row selection operations.
  
  @group Row Selection
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "selected",
      tsDoc: `The unique identifier of the row to be selected.`,
      doc: { en: `` },
      value: "string",
      optional: false,
    },
    {
      kind: "property",
      name: "pivot",
      tsDoc: `Sets the pivot row for range selections. Useful for extending selection ranges.`,
      doc: { en: `` },
      value: "string",
      optional: true,
    },
    {
      kind: "property",
      name: "selectBetweenPivot",
      doc: { en: `` },
      optional: true,
      tsDoc: `When true, selects the range of rows between the pivot and the selected row.`,
      value: "boolean",
    },
    {
      kind: "property",
      name: "deselect",
      tsDoc: `If true, the specified row will be deselected instead of selected.`,
      doc: { en: `` },
      optional: true,
      value: "boolean",
    },
    {
      kind: "property",
      name: "selectChildren",
      doc: { en: `` },
      optional: true,
      tsDoc: `If true, any child rows associated with the selected row will also be selected.`,
      value: "boolean",
    },
  ],
};

export const RowSelectAllOptions: InterfaceType = {
  kind: "interface",
  name: "RowSelectAllOptions",
  tsDoc: `
  Options for performing bulk selection or deselection of all rows.
  
  @group Row Selection
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      tsDoc: `If true, all rows will be deselected rather than selected.`,
      doc: { en: `` },
      name: "deselect",
      optional: true,
      value: "boolean",
    },
  ],
};
