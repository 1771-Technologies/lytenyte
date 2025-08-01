import type { FunctionType, InterfaceType, PropertyType, UnionType } from "../+types";
import {
  ColumnProp,
  ColumnSynonymProp,
  GridProp,
  RowIndexProp,
  RowNodeProp,
} from "./shared-properties";

export const EditableFnParams: InterfaceType = {
  kind: "interface",
  name: "EditableFnParams<T>",
  tsDoc: `
  Parameters passed to {@link EditableFn}, the predicate function used to determine
  if a specific cell in the grid is editable.

  These include the row index, the row node object, the grid instance, and the column
  definition.
  `,
  doc: { en: `` },
  export: true,
  properties: [RowIndexProp, RowNodeProp, GridProp, ColumnProp],
};

export const EditableFn: FunctionType = {
  kind: "function",
  name: "EditableFn<T>",
  tsDoc: `
  A predicate function that determines whether a particular cell is editable.

  If cell editing is enabled in LyteNyte Grid, this function is evaluated per cell. Use
  \`true\` for globally editable columns or {@link EditableFn} for row-specific logic.
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      tsDoc: `
      The parameters passed to the editable function. See {@link EditableFnParams}.
      `,
      doc: { en: `` },
      name: "params",
      optional: false,
      value: "EditableFnParams<T>",
    },
  ],
  return: "boolean",
};

export const Editable: UnionType = {
  kind: "union",
  tsDoc: `
  A column-level property that controls editability of cells.

  - Use \`true\` to enable editing for all rows.
  - Use {@link EditableFn} for conditional, row-specific editability.
  `,
  doc: { en: `` },
  export: true,
  name: "Editable<T>",
  types: ["boolean", "EditableFn<T>"],
};

const RowValidationStateProp: PropertyType = {
  kind: "property",
  name: "rowValidationState",
  value: "Record<string, any> | boolean | null",
  tsDoc: `
  Tracks the row's current validation status while editing.

  - \`false\`: validation failed
  - \`true\` or \`null\`: validation passed or hasn't run
  - \`Record<string, any>\`: failed with details per column
  `,
  doc: { en: `` },
  optional: false,
};

const EditValueProps: PropertyType = {
  kind: "property",
  name: "value",
  tsDoc: `
  The value currently being edited in the active cell.

  Managed internally by the grid, but should be aligned with the expected shape of your
  application's data model.
  `,
  doc: { en: `` },
  optional: false,
  value: "any",
};

export const EditRendererFnParams: InterfaceType = {
  kind: "interface",
  name: "EditRendererFnParams<T>",
  tsDoc: `
  Input parameters for the {@link EditRendererFn}, used to render the edit UI for a cell.

  These include positional and contextual data such as row, column, value, and grid
  instance, along with row validation status and change handlers.
  `,
  doc: { en: `` },
  export: true,
  properties: [
    RowIndexProp,
    RowNodeProp,
    GridProp,
    ColumnProp,
    RowValidationStateProp,
    EditValueProps,
    {
      kind: "property",
      name: "onChange",
      tsDoc: `
      A callback that must be called with the new value when the user changes the input.

      This triggers internal grid state updates and row validation.
      `,
      doc: { en: `` },
      optional: false,
      value: "(c: any) => void",
    },
  ],
};

export const EditRendererFn: FunctionType = {
  kind: "function",
  name: "EditRendererFn<T>",
  tsDoc: `
  A function that returns a React component to be rendered in edit mode for a given cell.

  Used for customizing editing UI. If omitted, a default HTML input will be used.
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      tsDoc: `
      Parameters passed to the edit renderer. See {@link EditRendererFnParams}.
      `,
      doc: { en: `` },
      optional: false,
      value: "EditRendererFnParams<T>",
    },
  ],
  return: "ReactNode",
};

export const EditRenderer: UnionType = {
  kind: "union",
  name: "EditRenderer<T>",
  export: true,
  tsDoc: `
  Defines the edit renderer for a column.

  Can be either:
  - A string key referencing a registered editor component
  - A function of type {@link EditRendererFn} for custom rendering logic
  `,
  doc: { en: `` },
  types: ["string", "EditRendererFn<T>"],
};

export const EditSetterParams: InterfaceType = {
  kind: "interface",
  name: "EditSetterParams<T>",
  doc: { en: `` },
  tsDoc: `
  Input parameters passed to an {@link EditSetterFn}.

  Provides the context needed to compute and apply new row data based on edit input.
  `,
  export: true,
  properties: [
    GridProp,
    RowNodeProp,
    RowIndexProp,
    ColumnProp,
    {
      kind: "property",
      name: "data",
      tsDoc: `
      The new row data after applying edits. This is an intermediate representation,
      not yet committed to the grid.
      `,
      doc: { en: `` },
      optional: false,
      value: "any",
    },
  ],
};

export const EditSetterFn: FunctionType = {
  kind: "function",
  name: "EditSetterFn<T>",
  tsDoc: `
  A function that returns a new row object based on the edited cell value.

  Required when dealing with nested, computed, or non-primitive values that the grid
  cannot update automatically.
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      optional: false,
      tsDoc: `The parameters for the edit setter. See {@link EditSetterParams}.`,
      doc: { en: `` },
      value: "EditSetterParams<T>",
    },
  ],
  return: "any",
};

export const EditRowValidatorFnParams: InterfaceType = {
  kind: "interface",
  name: "EditRowValidatorFnParams<T>",
  tsDoc: `
  Input arguments passed to {@link EditRowValidatorFn}.

  Used to perform validation on the entire row during or after edit submission.
  `,
  doc: { en: `` },
  export: true,
  properties: [
    GridProp,
    RowNodeProp,
    RowIndexProp,
    {
      kind: "property",
      name: "data",
      tsDoc: `The row data to validate.`,
      doc: { en: `` },
      optional: false,
      value: "any",
    },
  ],
};

export const EditRowValidatorFn: FunctionType = {
  kind: "function",
  name: "EditRowValidatorFn<T>",
  tsDoc: `
  A function that validates a fully edited row.

  Supports synchronous or object-based results for per-column validation. Must return:

  - \`true\` or \`null\` if the row is valid
  - \`false\` or a \`Record<string, any>\` describing errors if invalid
  `,
  doc: { en: `` },
  export: true,
  return: "Record<string, any> | boolean",
  properties: [
    {
      kind: "property",
      name: "params",
      tsDoc: `Inputs to the validator. See {@link EditRowValidatorFnParams}.`,
      doc: { en: `` },
      optional: false,
      value: "EditRowValidatorFnParams<T>",
    },
  ],
};

export const EditClickActivator: UnionType = {
  kind: "union",
  name: "EditClickActivator",
  tsDoc: `
  Specifies what kind of mouse interaction should initiate editing:

  - \`"single"\`: Single click
  - \`"double-click"\`: Double click
  - \`"none"\`: Editing must be started via API or programmatically
  `,
  doc: { en: `` },
  export: true,
  types: ['"single"', '"double-click"', '"none"'],
};

export const EditCellMode: UnionType = {
  kind: "union",
  name: "EditCellMode",
  tsDoc: `
  Controls whether a grid operates in inline editing mode:

  - \`"cell"\`: Editing is active and inline
  - \`"readonly"\`: Editing is disabled entirely
  `,
  doc: { en: `` },
  export: true,
  types: ['"cell"', '"readonly"'],
};

export const EditActivePosition: InterfaceType = {
  kind: "interface",
  name: "EditActivePosition<T>",
  tsDoc: `
  Describes the currently active cell position if editing is in progress.

  When no edit is active, this will be \`undefined\`.
  `,
  doc: { en: `` },
  export: true,
  properties: [RowIndexProp, ColumnProp],
};

export const EditBeginParams: InterfaceType = {
  kind: "interface",
  name: "EditBeginParams<T>",
  tsDoc: `
  Parameters accepted by the \`editBegin\` method to start editing a specific cell.
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "init",
      tsDoc: `
      Optional override value to use as the initial edit value. Defaults to the cell's
      current value.
      `,
      doc: { en: `` },
      optional: true,
      value: "any",
    },
    ColumnSynonymProp,
    RowIndexProp,
  ],
};

export const EditUpdateParams: InterfaceType = {
  kind: "interface",
  name: "EditUpdateParams<T>",
  tsDoc: `
  Parameters passed to the \`editUpdate\` method, used to submit a value change.
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "value",
      tsDoc: `
      The value to apply to the cell. It will go through normal validation and update
      handling.
      `,
      doc: { en: `` },
      optional: false,
      value: "any",
    },
    ColumnSynonymProp,
    RowIndexProp,
  ],
};

// EDIT EVENTS

export const EditDataProp: PropertyType = {
  kind: "property",
  name: "data",
  tsDoc: `
  The current value of the cell during an edit interaction.
  `,
  doc: { en: `` },
  optional: false,
  value: "any",
};

export const OnEditBeginParams: InterfaceType = {
  kind: "interface",
  name: "OnEditBeginParams<T>",
  tsDoc: `
  Parameters dispatched with the \`onEditBegin\` event, triggered when editing starts.
  `,
  doc: { en: `` },
  export: true,
  properties: [
    ColumnProp,
    RowIndexProp,
    {
      kind: "property",
      tsDoc: `
      Call this method to cancel edit initiation. Editing will not start if called.
      `,
      doc: { en: `` },
      name: "preventDefault",
      optional: false,
      value: "() => void",
    },
  ],
};

export const OnEditEndParams: InterfaceType = {
  kind: "interface",
  name: "OnEditEndParams<T>",
  tsDoc: `
  Parameters passed to the \`onEditEnd\` event, triggered when editing successfully completes.
  `,
  doc: { en: `` },
  export: true,
  properties: [ColumnProp, RowIndexProp, EditDataProp],
};

export const OnEditCancelParams: InterfaceType = {
  kind: "interface",
  name: "OnEditCancelParams<T>",
  tsDoc: `
  Parameters passed to the \`onEditCancel\` event, triggered when editing is aborted (e.g., Escape key).
  `,
  doc: { en: `` },
  export: true,
  properties: [ColumnProp, RowIndexProp, EditDataProp],
};

export const OnEditErrorParams: InterfaceType = {
  kind: "interface",
  name: "OnEditErrorParams<T>",
  tsDoc: `
  Parameters passed to the \`onEditError\` event, triggered when validation or logic errors occur during editing.
  `,
  doc: { en: `` },
  export: true,
  properties: [
    ColumnProp,
    RowIndexProp,
    EditDataProp,
    {
      kind: "property",
      name: "validation",
      doc: { en: `` },
      tsDoc: `
      Outcome of the row validator. 
      Can be \`false\` (invalid) or a record describing per-column issues.
      `,
      optional: false,
      value: "Record<string, any> | boolean",
    },
    {
      kind: "property",
      name: "error",
      doc: { en: `` },
      tsDoc: `
      Any uncaught exception encountered while applying the edit.
      `,
      optional: true,
      value: "unknown",
    },
  ],
};
