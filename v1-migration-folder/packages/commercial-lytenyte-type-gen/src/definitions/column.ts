import type {
  FunctionType,
  InterfaceType,
  InterfaceTypePartial,
  PropertyType,
  UnionType,
} from "../+types.js";
import { ColumnProp, GridProp, RowNodeProp } from "./shared-properties.js";

export const ColumnPin: UnionType = {
  kind: "union",
  name: "ColumnPin",
  export: true,
  tsDoc: `
  Represents the possible pinned positions a column can occupy in LyteNyte Grid.

  The actual position is determined by the document's reading direction:
  - In left-to-right (LTR) mode, \`"start"\` pins to the left and \`"end"\` to the right.
  - In right-to-left (RTL) mode, this behavior is reversed.

  This approach aligns with CSS logical properties for layout direction.
  `,
  doc: { en: `` },
  types: ['"start"', '"end"', "null"],
};

export const ColumnMeta: InterfaceType = {
  kind: "interface",
  name: "ColumnMeta<T>",
  export: true,
  tsDoc: `
  Represents runtime metadata for the current column configuration in LyteNyte Grid.

  This metadata is primarily useful for programmatic interaction with the grid. The values 
  are derived from the grid's internal column state and may change depending on modes 
  like pivoting. For example, when pivot mode is enabled, \`columnsVisible\` refers to 
  visible pivot columns instead of the regular ones.
  `,
  doc: { en: `` },
  properties: [
    {
      kind: "property",
      name: "columnsVisible",
      value: "Column<T>[]",
      optional: false,
      tsDoc: `
      An array of currently visible columns, accounting for \`hide\` flags and 
      column group collapse states.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "columnLookup",
      value: "Map<string, Column<T>>",
      optional: false,
      tsDoc: `
      A lookup map from column id to column definition. Useful for quick access or 
      metadata introspection.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "columnVisibleStartCount",
      value: "number",
      optional: false,
      tsDoc: `
      The count of visible columns pinned to the start of the grid.
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "columnVisibleCenterCount",
      value: "number",
      optional: false,
      tsDoc: `
      The count of visible columns that are unpinned (center-aligned).
      `,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "columnVisibleEndCount",
      value: "number",
      optional: false,
      tsDoc: `
      The count of visible columns pinned to the end of the grid.
      `,
      doc: { en: `` },
    },
  ],
};

const SortableHint: PropertyType = {
  kind: "property",
  name: "sortable",
  tsDoc: `
  UI hint indicating whether this column supports sorting. LyteNyte Grid may 
  hide sort controls if this is set to \`false\`.
  `,
  doc: { en: `A UI hint indicating if the column may be sorted.` },
  optional: true,
  value: "boolean",
};

const RowGroupableHint: PropertyType = {
  kind: "property",
  name: "rowGroupable",
  tsDoc: `
  UI hint indicating whether this column can be used for row grouping.
  `,
  doc: { en: `A UI hint indicating if the column may be row grouped.` },
  optional: true,
  value: "boolean",
};

const ResizableHint: PropertyType = {
  kind: "property",
  name: "resizable",
  tsDoc: `
  UI hint indicating whether the column can be resized by the user.
  When set to \`false\`, resize handles will be hidden.
  `,
  doc: { en: `` },
  optional: true,
  value: "boolean",
};

const MovableHint: PropertyType = {
  kind: "property",
  name: "movable",
  tsDoc: `
  UI hint indicating whether the column can be repositioned by dragging.
  This only affects drag-and-drop behaviors; programmatic moves are still possible.
  `,
  doc: { en: `A UI hint indicating if the column may be moved (usually by dragging).` },
  optional: true,
  value: "boolean",
};

const AggregationHint: PropertyType = {
  kind: "property",
  name: "aggDefault",
  tsDoc: `
  UI hint specifying the default aggregation function to apply to this column.

  This is especially relevant in pivot mode or when row grouping is active.
  `,
  doc: {
    en: `A UI hint indicating the default aggregation to apply for a column. Useful for when a column is used as a pivot value or row groups are applied.`,
  },
  optional: true,
  value: "string",
};

const AggregationAllowed: PropertyType = {
  kind: "property",
  name: "aggsAllowed",
  tsDoc: `
  UI hint specifying the list of valid aggregation functions that can be applied to this column.
  If unset, the column may not support aggregation.
  `,
  doc: { en: `` },
  optional: true,
  value: "string[]",
};

export const ColumnUIHints: InterfaceType = {
  kind: "interface",
  name: "ColumnUIHints",
  tsDoc: `
  A set of optional UI hints that external consumers and LyteNyte Grid itself can use 
  to determine a column's capabilities.

  These hints inform the rendering of column headers (e.g. showing resize handles, 
  drag handles, sort indicators), but are not enforced. Developers can still override 
  behaviors via the grid state API directly.
  `,
  doc: { en: `` },
  export: true,
  properties: [
    SortableHint,
    RowGroupableHint,
    ResizableHint,
    MovableHint,
    AggregationHint,
    AggregationAllowed,
  ],
};

export const ColumnPivotUIHints: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  tsDoc: `
  Describes UI hints related to column pivot functionality.

  These hints indicate whether a column is eligible to act as a value, row group, or 
  column pivot in a pivot table configuration. External components can use these values 
  to determine pivot-related capabilities.
  `,
  export: true,
  name: "ColumnPivotUIHints",
  tag: "pro",
  properties: [
    {
      kind: "property",
      name: "value",
      doc: { en: `` },
      optional: true,
      tsDoc: `
      Indicates whether the column can be used as a pivot value.
      `,
      value: "boolean",
    },
    {
      kind: "property",
      name: "rows",
      doc: { en: `` },
      optional: true,
      tsDoc: `
      Indicates whether the column can be used as a pivot row group.
      `,
      value: "boolean",
    },
    {
      kind: "property",
      name: "columns",
      doc: { en: `` },
      optional: true,
      tsDoc: `
      Indicates whether the column can be used as a pivot column header.
      `,
      value: "boolean",
    },
  ],
};

const ColumnPivotUIHint: PropertyType = {
  kind: "property",
  name: "columnPivot",
  optional: true,
  value: "ColumnPivotUIHints",
  tsDoc: `
  UI hints for pivot-related behaviors, specifying whether a column can act as a value, 
  row, or column pivot.
  `,
  doc: { en: `` },
};

export const ColumnUIHintsPro: InterfaceType = {
  kind: "interface",
  name: "ColumnUIHints",
  tsDoc: `
  UI hints describing column capabilities in LyteNyte Grid.

  These hints can be used by external components to drive UI decisions (e.g. 
  enabling/disabling sort or resize handles). They are not enforced by LyteNyte Grid
  and can be bypassed by modifying grid state directly.

  Includes support for pivot-specific behaviors via {@link ColumnPivotUIHints}.
  `,
  doc: { en: `` },
  export: true,
  tag: "pro",
  properties: [
    SortableHint,
    RowGroupableHint,
    ResizableHint,
    MovableHint,
    AggregationHint,
    AggregationAllowed,
    ColumnPivotUIHint,
  ],
};

export const AutosizeCellParams: InterfaceType = {
  kind: "interface",
  name: "AutosizeCellParams<T>",
  tsDoc: `
  Parameters passed to the {@link AutosizeCellFn} function. 

  These provide context about the cell and grid configuration so that the function 
  can determine the optimal column width based on cell content.
  `,
  doc: { en: `` },
  export: true,
  properties: [ColumnProp, GridProp, RowNodeProp],
};

export const AutosizeHeaderParams: InterfaceType = {
  kind: "interface",
  name: "AutosizeHeaderParams<T>",
  tsDoc: `
  Parameters passed to the {@link AutosizeHeaderFn} function.

  These are used by LyteNyte Grid to calculate the ideal column width based on the 
  header content.
  `,
  doc: { en: `` },
  export: true,
  properties: [ColumnProp, GridProp],
};

export const AutosizeCellFn: FunctionType = {
  kind: "function",
  name: "AutosizeCellFn<T>",
  tsDoc: `
  A function used by LyteNyte Grid to determine the ideal width for a column based 
  on a representative sample of cell content.

  This is called when autosize is triggered via the grid's API. Returning \`null\` 
  disables sizing behavior.
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      optional: false,
      value: "AutosizeCellParams<T>",
      tsDoc: `
      The input parameters passed to the autosize function to determine the optimal 
      column width.
      `,
      doc: { en: `` },
    },
  ],
  return: "number | null",
};

export const AutosizeHeaderFn: FunctionType = {
  kind: "function",
  name: "AutosizeHeaderFn<T>",
  tsDoc: `
  A function used by LyteNyte Grid to calculate the ideal width for a column header 
  based on the header's rendered content.

  This is called as part of the grid's autosize process.
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      optional: false,
      value: "AutosizeHeaderParams<T>",
      tsDoc: `
      The input parameters used to evaluate the ideal width for a column header.
      `,
      doc: { en: `` },
    },
  ],
  return: "number | null",
};

/**
 * COLUMN DEFINITION
 */

const Hide: PropertyType = {
  kind: "property",
  name: "hide",
  value: "boolean",
  tsDoc: `Controls the visibility of the column. When set to \`true\`, the column is hidden from the grid display.`,
  doc: { en: `` },
  optional: true,
};

const Id: PropertyType = {
  kind: "property",
  name: "id",
  value: "string",
  tsDoc: `A required unique identifier for the column. This value must be distinct among all columns.`,
  doc: { en: `` },
  optional: false,
};

const Width: PropertyType = {
  kind: "property",
  name: "width",
  value: "number",
  tsDoc: `Specifies the preferred width of the column. This value is ignored if flex sizing is used, or if it violates the column's min/max bounds.`,
  doc: { en: `` },
  optional: true,
};

const WidthMax: PropertyType = {
  kind: "property",
  name: "widthMax",
  value: "number",
  tsDoc: `Defines the maximum width the column is allowed to occupy.`,
  doc: { en: `` },
  optional: true,
};

const WidthMin: PropertyType = {
  kind: "property",
  name: "widthMin",
  value: "number",
  tsDoc: `Defines the minimum width the column is allowed to occupy.`,
  doc: { en: `` },
  optional: true,
};

const WidthFlex: PropertyType = {
  kind: "property",
  name: "widthFlex",
  value: "number",
  tsDoc: `Specifies the flex ratio this column should take when distributing remaining space.

  Similar to CSS \`flex\`, it controls how extra space is shared among flex-enabled columns.`,
  doc: { en: `` },
  optional: true,
};

const ColumnPinProp: PropertyType = {
  kind: "property",
  name: "pin",
  value: "ColumnPin",
  optional: true,
  tsDoc: `Defines whether the column is pinned to the start or end of the grid. Pinned columns remain visible regardless of horizontal scroll.`,
  doc: { en: `` },
};

const ColumnGroupVisibilityProp: PropertyType = {
  kind: "property",
  name: "groupVisibility",
  value: "ColumnGroupVisibility",
  optional: true,
  tsDoc: `Controls the visibility behavior of a column when its group is collapsed.

  Determines whether the column is always visible, only visible when expanded, or only visible when collapsed.`,
  doc: { en: `` },
};

const ColumnGroupPath: PropertyType = {
  kind: "property",
  name: "groupPath",
  value: "string[]",
  optional: true,
  tsDoc: `Represents the hierarchical path of column groups the column belongs to. Each string corresponds to a level in the nesting hierarchy.`,
  doc: { en: `` },
};

const ColumnSpan: PropertyType = {
  kind: "property",
  name: "colSpan",
  optional: true,
  tsDoc: `Defines how many columns the cell should span. Can be a fixed number or a function that returns a span dynamically.`,
  doc: { en: `` },
  value: `number | CellSpanFn<T>`,
};

const RowSpan: PropertyType = {
  kind: "property",
  name: "rowSpan",
  optional: true,
  tsDoc: `Defines how many rows the cell should span. Can be a fixed number or a function that returns a span dynamically.`,
  doc: { en: `` },
  value: `number | CellSpanFn<T>`,
};

const Name: PropertyType = {
  kind: "property",
  name: "name",
  optional: true,
  tsDoc: `A human-readable name for the column. Useful when \`id\` is more technical or programmatic.`,
  doc: { en: `` },
  value: "string",
};

const Field: PropertyType = {
  kind: "property",
  name: "field",
  optional: true,
  tsDoc: `Determines how the cell value should be retrieved or computed for the column. If omitted, the column's \`id\` is used as a fallback.`,
  doc: { en: `` },
  value: "Field<T>",
};

const CellRenderer: PropertyType = {
  kind: "property",
  name: "cellRenderer",
  optional: true,
  tsDoc: `Defines how to render the cell content. Accepts a renderer function or a string referencing a registered renderer.`,
  doc: { en: `` },
  value: "string | CellRendererFn<T>",
};

const HeaderRenderer: PropertyType = {
  kind: "property",
  name: "headerRenderer",
  optional: true,
  tsDoc: `Function used to render the column's header. Must return a React node.`,
  doc: { en: `` },
  value: "HeaderCellRenderer<T>",
};

const FloatingRenderer: PropertyType = {
  kind: "property",
  name: "floatingRenderer",
  optional: true,
  tsDoc: `Function used to render a floating row cell. Only called when floating rows are enabled. Must return a React node.`,
  doc: { en: `` },
  value: "HeaderFloatingCellRenderer<T>",
};

const ColumnHintsProp: PropertyType = {
  kind: "property",
  name: "uiHints",
  optional: true,
  tsDoc: `Describes the capabilities and intended UI behavior of the column. These hints are used by external UI components.`,
  doc: { en: `` },
  value: "ColumnUIHints",
};

const EditableProp: PropertyType = {
  kind: "property",
  name: "editable",
  optional: true,
  tsDoc: `Controls whether cells in the column can be edited.

  Editing is only possible when both the grid is in edit mode and this flag is set.`,
  doc: { en: `` },
  value: "Editable<T>",
};

const EditRenderProp: PropertyType = {
  kind: "property",
  name: "editRenderer",
  optional: true,
  tsDoc: `Specifies a custom cell editor to use when the cell enters edit mode.`,
  doc: { en: `` },
  value: "EditRenderer<T>",
};

const EditSetterProp: PropertyType = {
  kind: "property",
  name: "editSetter",
  optional: true,
  tsDoc: `Custom logic for applying an edit to the row's data. Required when editing fields that need special update logic.`,
  doc: { en: `` },
  value: "EditSetterFn<T>",
};

const ColumnType: PropertyType = {
  kind: "property",
  name: "type",
  optional: true,
  tsDoc: `Specifies the column's data type. Can be one of the built-in types or a custom string label.`,
  doc: { en: `` },
  value: '"string" | "number" | "date" | "datetime" | ({} & string)',
};

const AutosizeCellFnProp: PropertyType = {
  kind: "property",
  name: "autosizeCellFn",
  optional: true,
  tsDoc: `Function that computes the ideal width for the column based on sampled cell content.`,
  doc: { en: `` },
  value: "AutosizeCellFn<T>",
};

const AutosizeHeaderFnProp: PropertyType = {
  kind: "property",
  name: "autosizeHeaderFn",
  optional: true,
  tsDoc: `Function that computes the ideal width for the column header based on its content.`,
  doc: { en: `` },
  value: "AutosizeHeaderFn<T>",
};

export const ColumnMarker: InterfaceType = {
  kind: "interface",
  export: true,
  name: "ColumnMarker<T>",
  doc: { en: `` },
  tsDoc: `Defines the structure of a marker column.

  The marker column is a grid managed column used to support features like selection checkboxes or row drag handles.`,
  properties: [CellRenderer, HeaderRenderer, FloatingRenderer, Width, ColumnHintsProp],
};

const ColumnPartial: InterfaceTypePartial = {
  kind: "interface-partial",
  properties: [
    Id,
    Name,
    ColumnType,
    Hide,
    Width,
    WidthMax,
    WidthMin,
    WidthFlex,
    ColumnPinProp,
    ColumnGroupVisibilityProp,
    ColumnGroupPath,

    ColumnSpan,
    RowSpan,

    Field,

    HeaderRenderer,
    FloatingRenderer,
    CellRenderer,

    ColumnHintsProp,

    EditableProp,
    EditRenderProp,
    EditSetterProp,

    AutosizeCellFnProp,
    AutosizeHeaderFnProp,
  ],
};

export const Column: InterfaceType = {
  kind: "interface",
  export: true,
  name: "Column<T>",
  tsDoc: `
  Describes a column definition in LyteNyte Grid.

  Columns define how data is presented and interacted with in the grid. They control
  rendering, grouping, sorting, filtering, editing, and more.

  A grid must define at least one column to display meaningful data. Columns are essential 
  for determining:
  - How rows are visualized
  - What each cell renders
  - How rows are grouped and sorted
  - How filters are evaluated
  `,
  doc: { en: `` },
  properties: [],
  extends: ColumnPartial,
  tag: "core",
};

const ColumnBasePartial: InterfaceTypePartial = {
  kind: "interface-partial",
  properties: [
    Hide,
    Width,
    WidthMax,
    WidthMin,
    WidthFlex,

    HeaderRenderer,
    FloatingRenderer,
    CellRenderer,
    ColumnHintsProp,

    EditableProp,
    EditRenderProp,
    EditSetterProp,

    AutosizeCellFnProp,
    AutosizeHeaderFnProp,
  ],
};

export const ColumnBase: InterfaceType = {
  kind: "interface",
  export: true,
  name: "ColumnBase<T>",
  properties: [],
  tsDoc: `
  Represents the default column configuration used by LyteNyte Grid.

  This serves as a base template that provides fallback values for various column properties. 
  Rather than merging, LyteNyte Grid looks up configuration properties on the column first, 
  then on the default.

  This allows you to set column-wide defaults that apply retroactively to all applicable columns 
  without rewriting each one.
  `,
  doc: { en: `` },
  extends: ColumnBasePartial,
  tag: "core",
};

export const ColumnRowGroup: InterfaceType = {
  kind: "interface",
  export: true,
  name: "RowGroupColumn<T>",
  doc: { en: `` },
  tsDoc: `
  The internal definition used by LyteNyte Grid to automatically generate group columns 
  when row grouping is enabled.

  These columns are created behind the scenes to represent group headers and aggregations 
  and can be configured via this interface.
  `,
  properties: [
    Name,
    Hide,
    Width,
    WidthMax,
    WidthMin,
    WidthFlex,
    ColumnPinProp,

    Field,

    CellRenderer,
    HeaderRenderer,
    FloatingRenderer,

    ColumnHintsProp,

    AutosizeCellFnProp,
    AutosizeHeaderFnProp,
  ],
};

/**
 * PRO
 */
const QuickSearchIgnore: PropertyType = {
  kind: "property",
  name: "quickSearchIgnore",
  optional: true,
  value: "boolean",
  tsDoc: `
  When \`true\`, the column is excluded from the quick search filter.

  Useful for non-textual or metadata columns that should not be searchable by users.
  `,
  doc: { en: `` },
};

export const ColumnPro: InterfaceType = {
  kind: "interface",
  export: true,
  name: "Column<T>",
  tsDoc: `
  Describes a column definition in LyteNyte Grid.

  Columns define how data is presented and interacted with in the grid. They control
  rendering, grouping, sorting, filtering, editing, and more.

  A grid must define at least one column to display meaningful data. Columns are essential 
  for determining:
  - How rows are visualized
  - What each cell renders
  - How rows are grouped and sorted
  - How filters are evaluated
  `,
  doc: { en: `` },
  properties: [QuickSearchIgnore],
  extends: ColumnPartial,
  tag: "pro",
};

export const ColumnBasePro: InterfaceType = {
  kind: "interface",
  export: true,
  name: "ColumnBase<T>",
  properties: [QuickSearchIgnore],
  tsDoc: `
  Represents the default column configuration used by LyteNyte Grid.

  This serves as a base template that provides fallback values for various column properties. 
  Rather than merging, LyteNyte Grid looks up configuration properties on the column first, 
  then on the default.

  This allows you to set column-wide defaults that apply retroactively to all applicable columns 
  without rewriting each one.
  `,
  doc: { en: `` },
  extends: ColumnBasePartial,
  tag: "pro",
};
