import type { FunctionType, InterfaceType, InterfaceTypePartial, PropertyType } from "../+types.js";
import { GridProp } from "./shared-properties.js";

const ExpansionProp: PropertyType = {
  kind: "property",
  name: "expansions",
  tsDoc: `A map representing the current expansion state of row groups. Each key corresponds to a row id, and the value indicates whether that row group is expanded.`,
  doc: { en: `` },
  optional: false,
  value: "{ [rowId: string]: boolean }",
};

export const RowExpandBeginParams: InterfaceType = {
  kind: "interface",
  name: "RowExpandBeginParams<T>",
  tsDoc: `
  Describes the parameters passed to the \`rowExpandBegin\` event. This event is triggered before row group expansion occurs and provides a way to cancel the action.
  
  @group Events
  `,
  doc: { en: `` },
  export: true,
  properties: [
    GridProp,
    ExpansionProp,
    {
      kind: "property",
      name: "preventDefault",
      tsDoc: `Callback to prevent the row group from expanding. Must be explicitly invoked within the event handler.`,
      doc: { en: `` },
      optional: false,
      value: "() => void",
    },
  ],
};

export const RowExpandParams: InterfaceType = {
  kind: "interface",
  name: "RowExpandParams<T>",
  tsDoc: `Describes the parameters passed to the \`rowExpand\` event. This event is emitted after a row group has been successfully expanded.
  
  @group Events
  `,
  doc: { en: `` },
  export: true,
  properties: [GridProp, ExpansionProp],
};

export const RowExpandErrorParams: InterfaceType = {
  kind: "interface",
  name: "RowExpandErrorParams<T>",
  tsDoc: `Describes the parameters passed to the \`rowExpandError\` event. This event is emitted when an error occurs during row group expansion.
  
  @group Events
  `,
  doc: { en: `` },
  export: true,
  properties: [
    GridProp,
    ExpansionProp,
    {
      kind: "property",
      name: "error",
      tsDoc: `The error that was thrown or returned during row group expansion.`,
      doc: { en: `` },
      optional: false,
      value: "unknown",
    },
  ],
};

export const RowExpandBegin: FunctionType = {
  kind: "function",
  name: "RowExpandBeginFn<T>",
  tsDoc: `Event handler function type for the \`rowExpandBegin\` event. Triggered before row group expansion, allowing you to cancel the operation.
  
  @group Events
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      tsDoc: `The parameters provided to the \`rowExpandBegin\` event.`,
      doc: { en: `` },
      optional: false,
      value: "RowExpandBeginParams<T>",
    },
  ],
  return: "void",
};

export const RowExpand: FunctionType = {
  kind: "function",
  name: "RowExpandFn<T>",
  tsDoc: `Event handler function type for the \`rowExpand\` event. Called when row group expansion is successfully completed.
  
  @group Events
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      tsDoc: `The parameters provided to the \`rowExpand\` event.`,
      doc: { en: `` },
      optional: false,
      value: "RowExpandParams<T>",
    },
  ],
  return: "void",
};

export const RowExpandError: FunctionType = {
  kind: "function",
  name: "RowExpandErrorFn<T>",
  tsDoc: `Event handler function type for the \`rowExpandError\` event. Called when row group expansion fails due to an error.
  
  @group Events
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      tsDoc: `The parameters provided to the \`rowExpandError\` event.`,
      doc: { en: `` },
      optional: false,
      value: "RowExpandErrorParams<T>",
    },
  ],
  return: "void",
};

export const EditBegin: FunctionType = {
  kind: "function",
  name: "EditBegin<T>",
  tsDoc: `An event fired when a cell begins editing. This provides an opportunity to cancel the edit before any changes are made.
  
  @group Events
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      tsDoc: `Details about the cell and context for the edit initiation.`,
      doc: { en: `` },
      optional: false,
      value: "OnEditBeginParams<T>",
    },
  ],
  return: "void",
};

export const EditEnd: FunctionType = {
  kind: "function",
  name: "EditEnd<T>",
  tsDoc: `An event fired when a cell finishes editing successfully (i.e., without error or cancellation).
  
  @group Events
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      tsDoc: `Details about the edit session and updated value, if applicable.`,
      doc: { en: `` },
      optional: false,
      value: "OnEditEndParams<T>",
    },
  ],
  return: "void",
};

export const EditCancel: FunctionType = {
  kind: "function",
  name: "EditCancel<T>",
  tsDoc: `An event fired when an in-progress cell edit is canceled. Most commonly triggered by user interaction, such as pressing the Escape key.
  
  @group Events
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      tsDoc: `Information about the cell and state at the time of cancellation.`,
      doc: { en: `` },
      optional: false,
      value: "OnEditCancelParams<T>",
    },
  ],
  return: "void",
};

export const EditError: FunctionType = {
  kind: "function",
  name: "EditError<T>",
  tsDoc: `An event fired when an error occurs during cell editing—either due to validation failure or runtime exception.
  
  @group Events
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      tsDoc: `Contextual details and error object associated with the failure.`,
      doc: { en: `` },
      optional: false,
      value: "OnEditErrorParams<T>",
    },
  ],
  return: "void",
};

export const RowDetailExpansionBeginParams: InterfaceType = {
  tsDoc: `The parameters for the \`rowDetailExpansionBegin\` event. This event allows preventing expansion of row detail sections by calling \`preventDefault()\`.
  
  
  @group Events
  `,
  name: "RowDetailExpansionBeginParams<T>",
  doc: { en: `` },
  export: true,
  kind: "interface",
  properties: [
    GridProp,
    {
      kind: "property",
      name: "expansions",
      tsDoc: `A \`Set\` containing the row ids currently marked for detail expansion.`,
      doc: { en: `` },
      optional: false,
      value: "Set<string>",
    },
    {
      kind: "property",
      name: "preventDefault",
      tsDoc: `Call this function to cancel the row detail expansion.`,
      doc: { en: `` },
      optional: false,
      value: "() => void",
    },
  ],
};

export const RowDetailExpansionEndParams: InterfaceType = {
  tsDoc: `The parameters for the \`rowDetailExpansionEnd\` event, fired once a row detail expansion operation is complete.
  
  
  @group Events
  `,
  name: "RowDetailExpansionEndParams<T>",
  doc: { en: `` },
  export: true,
  kind: "interface",
  properties: [
    GridProp,
    {
      kind: "property",
      name: "expansions",
      tsDoc: `A \`Set\` of row ids that are currently expanded in the detail view.`,
      doc: { en: `` },
      optional: false,
      value: "Set<string>",
    },
  ],
};

export const RowDetailExpansionBegin: FunctionType = {
  kind: "function",
  name: "RowDetailExpansionBegin<T>",
  tsDoc: `An event fired when the row detail expansion process begins. This provides an opportunity to cancel expansion before it takes effect.
  
  @group Events
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      tsDoc: `The event payload passed to the \`rowDetailExpansionBegin\` callback.`,
      doc: { en: `` },
      optional: false,
      value: "RowDetailExpansionBeginParams<T>",
    },
  ],
  return: "void",
};

export const RowDetailExpansionEnd: FunctionType = {
  kind: "function",
  name: "RowDetailExpansionEnd<T>",
  tsDoc: `An event fired after the row detail expansion completes successfully.
  
  @group Events
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      tsDoc: `The event payload passed to the \`rowDetailExpansionEnd\` callback.`,
      doc: { en: `` },
      optional: false,
      value: "RowDetailExpansionEndParams<T>",
    },
  ],
  return: "void",
};

const RowSelectedProp: PropertyType = {
  kind: "property",
  name: "selected",
  tsDoc: `The id of the row that was selected or deselected during the selection event.`,
  doc: { en: `` },
  optional: false,
  value: "string",
};

const DeselectProp: PropertyType = {
  kind: "property",
  name: "deselect",
  tsDoc: `Indicates whether the selection event represents a deselection. 
If \`true\`, the row was deselected; otherwise, it was selected.`,
  doc: { en: `` },
  optional: false,
  value: "boolean",
};

export const RowSelectBeginParams: InterfaceType = {
  kind: "interface",
  name: "RowSelectBeginParams<T>",
  tsDoc: `
  The parameters provided when a row selection begins. This event occurs before the selection change takes effect, 
  giving the caller an opportunity to prevent it.

  @group Events
`,
  doc: { en: `` },
  export: true,
  properties: [
    RowSelectedProp,
    GridProp,
    DeselectProp,
    {
      kind: "property",
      name: "preventDefault",
      tsDoc: `A function that, when called, cancels the row selection operation.`,
      doc: { en: `` },
      optional: false,
      value: "() => void",
    },
  ],
};

export const RowSelectBegin: FunctionType = {
  kind: "function",
  name: "RowSelectBegin<T>",
  tsDoc: `
  An event triggered when a row selection starts. This event allows cancellation before the selection is finalized.
  
  @group Events
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      doc: { en: `` },
      optional: false,
      tsDoc: `The parameters describing the row selection attempt.`,
      value: "RowSelectBeginParams<T>",
    },
  ],
  return: "void",
};

export const RowSelectEndParams: InterfaceType = {
  kind: "interface",
  name: "RowSelectEndParams<T>",
  tsDoc: `
  The parameters passed when a row selection has completed.
  
  @group Events
  `,
  doc: { en: `` },
  export: true,
  properties: [RowSelectedProp, GridProp, DeselectProp],
};

export const RowSelectEnd: FunctionType = {
  kind: "function",
  name: "RowSelectEnd<T>",
  tsDoc: `
  An event triggered once the row selection is finalized.
  
  @group Events
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      doc: { en: `` },
      tsDoc: `The parameters describing the completed row selection.`,
      optional: false,
      value: "RowSelectEndParams<T>",
    },
  ],
  return: "void",
};

export const RowSelectAllBeginParams: InterfaceType = {
  kind: "interface",
  name: "RowSelectAllBeginParams<T>",
  tsDoc: `
  The parameters provided when a "select all" operation starts. This event allows the operation to be canceled.
  
  @group Events
  `,
  doc: { en: `` },
  export: true,
  properties: [
    DeselectProp,
    GridProp,
    {
      kind: "property",
      name: "preventDefault",
      doc: { en: `` },
      optional: false,
      tsDoc: `A function that, when invoked, prevents all rows from being selected.`,
      value: "() => void",
    },
  ],
};

export const RowSelectAllEndParams: InterfaceType = {
  kind: "interface",
  name: "RowSelectAllEndParams<T>",
  tsDoc: `
  The parameters passed when a "select all" operation completes.
  
  @group Events
  `,
  doc: { en: `` },
  export: true,
  properties: [DeselectProp, GridProp],
};

export const RowSelectAllBegin: FunctionType = {
  kind: "function",
  name: "RowSelectAllBegin<T>",
  tsDoc: `
  An event triggered when the "select all" operation begins. It provides an opportunity to cancel the selection.
  
  @group Events
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      doc: { en: `` },
      tsDoc: `The parameters associated with the "select all" operation.`,
      optional: false,
      value: "RowSelectAllBeginParams<T>",
    },
  ],
  return: "void",
};

export const RowSelectAllEnd: FunctionType = {
  kind: "function",
  name: "RowSelectAllEnd<T>",
  tsDoc: `
  An event triggered once the "select all" operation is complete.
  
  @group Events
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "params",
      doc: { en: `` },
      tsDoc: `The parameters describing the completed "select all" action.`,
      optional: false,
      value: "RowSelectAllEndParams<T>",
    },
  ],
  return: "void",
};

const ColumnMoveParamsPartial: InterfaceTypePartial = {
  kind: "interface-partial",
  properties: [
    {
      kind: "property",
      tsDoc: `An array of column definitions representing the columns being moved during the operation.`,
      doc: { en: `` },
      name: "moveColumns",
      value: "Column<T>[]",
      optional: false,
    },
    {
      kind: "property",
      tsDoc: `The target column reference used to determine the new insertion position for the moved columns.`,
      doc: { en: `` },
      name: "moveTarget",
      optional: false,
      value: "Column<T>",
    },
    {
      kind: "property",
      tsDoc: `Indicates whether the moved columns should be inserted before (\`true\`) or after (\`false\`) the target column.`,
      doc: { en: `` },
      name: "before",
      optional: false,
      value: "boolean",
    },
    {
      kind: "property",
      tsDoc: `Whether the moved columns should inherit the pinning state of the target column.`,
      doc: { en: `` },
      name: "updatePinState",
      optional: false,
      value: "boolean",
    },
  ],
};

export const ColumnMoveBeginParams: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  tsDoc: `
  The parameters provided when a column move operation begins. This event allows the move action to be canceled.
  
  @group Events
  `,
  export: true,
  name: "ColumnMoveBeginParams<T>",
  extends: ColumnMoveParamsPartial,
  properties: [
    GridProp,
    {
      kind: "property",
      name: "preventDefault",
      tsDoc: `A function that, when invoked, cancels the column move operation.`,
      doc: { en: `` },
      value: "() => void",
      optional: false,
    },
  ],
};

export const ColumnMoveEndParams: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  tsDoc: `
  The parameters emitted when a column move operation has completed.
  
  @group Events
  `,
  export: true,
  name: "ColumnMoveEndParams<T>",
  extends: ColumnMoveParamsPartial,
  properties: [GridProp],
};

export const ColumnMoveBeginFn: FunctionType = {
  kind: "function",
  name: "ColumnMoveBeginFn<T>",
  tsDoc: `
  A callback function type for the columnMoveBegin event, fired when a column move starts.
  
  @group Events
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      tsDoc: `The parameters passed to the columnMoveBegin event.`,
      doc: { en: `` },
      name: "params",
      optional: true,
      value: "ColumnMoveBeginParams<T>",
    },
  ],
  return: "void",
};

export const ColumnMoveEndFn: FunctionType = {
  kind: "function",
  name: "ColumnMoveEndFn<T>",
  tsDoc: `
  A callback function type for the columnMoveEnd event, fired when a column move completes.
  
  @group Events
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      tsDoc: `The parameters passed to the columnMoveEnd event.`,
      doc: { en: `` },
      name: "params",
      optional: true,
      value: "ColumnMoveEndParams<T>",
    },
  ],
  return: "void",
};

/**
 *  Events object
 */

const RowExpandBeginProp: PropertyType = {
  kind: "property",
  name: "rowExpandBegin",
  tsDoc: `
  Event fired when a row group expansion is about to begin. This allows canceling the expansion via preventDefault.
  `,
  doc: { en: `` },
  optional: true,
  value: "RowExpandBeginFn<T>",
};

const RowExpandProp: PropertyType = {
  kind: "property",
  name: "rowExpand",
  tsDoc: `Event fired once a row group expansion has successfully completed.`,
  doc: { en: `` },
  optional: true,
  value: "RowExpandFn<T>",
};

const RowExpandEnd: PropertyType = {
  kind: "property",
  name: "rowExpandError",
  tsDoc: `Event fired if an error occurs during the row group expansion process.`,
  doc: { en: `` },
  optional: true,
  value: "RowExpandErrorFn<T>",
};

const EditBeginProp: PropertyType = {
  kind: "property",
  name: "editBegin",
  tsDoc: `Event fired when a cell begins editing. Provides an opportunity to cancel the edit action.`,
  doc: { en: `` },
  optional: true,
  value: "EditBegin<T>",
};

const EditEndProp: PropertyType = {
  kind: "property",
  name: "editEnd",
  tsDoc: `Event fired when a cell edit is successfully completed.`,
  doc: { en: `` },
  optional: true,
  value: "EditEnd<T>",
};

const EditCancelProp: PropertyType = {
  kind: "property",
  name: "editCancel",
  tsDoc: `Event fired when cell editing is canceled, typically via keyboard action like Escape.`,
  doc: { en: `` },
  optional: true,
  value: "EditCancel<T>",
};

const EditErrorProp: PropertyType = {
  kind: "property",
  name: "editError",
  tsDoc: `Event fired if an error occurs during cell editing, such as validation failure or exception.`,
  doc: { en: `` },
  optional: true,
  value: "EditError<T>",
};

const RowDetailExpansionBeginProp: PropertyType = {
  kind: "property",
  name: "rowDetailExpansionBegin",
  tsDoc: `Event fired when a row detail expansion is about to begin. Can be canceled.`,
  doc: { en: `` },
  optional: true,
  value: "RowDetailExpansionBegin<T>",
};

const RowDetailExpansionEndProp: PropertyType = {
  kind: "property",
  name: "rowDetailExpansionEnd",
  tsDoc: `Event fired when a row detail expansion has successfully completed.`,
  doc: { en: `` },
  optional: true,
  value: "RowDetailExpansionEnd<T>",
};

const RowSelectBeginProp: PropertyType = {
  kind: "property",
  name: "rowSelectBegin",
  tsDoc: `Event fired when row selection starts. Allows preventing the selection.`,
  doc: { en: `` },
  optional: true,
  value: "RowSelectBegin<T>",
};

const RowSelectEndProp: PropertyType = {
  kind: "property",
  name: "rowSelectEnd",
  tsDoc: `Event fired when row selection has completed.`,
  doc: { en: `` },
  optional: true,
  value: "RowSelectEnd<T>",
};

const RowSelectAllBeginProp: PropertyType = {
  kind: "property",
  name: "rowSelectAllBegin",
  tsDoc: `Event fired at the start of a "select all rows" operation. Can be canceled.`,
  doc: { en: `` },
  optional: true,
  value: "RowSelectAllBegin<T>",
};

const RowSelectAllEndProp: PropertyType = {
  kind: "property",
  name: "rowSelectAllEnd",
  tsDoc: `Event fired when a "select all rows" operation completes.`,
  doc: { en: `` },
  optional: true,
  value: "RowSelectAllEnd<T>",
};

const ColumnMoveDragBeginProp: PropertyType = {
  kind: "property",
  name: "columnMoveDragBegin",
  tsDoc: `Event fired when a column drag move operation begins.`,
  doc: { en: `` },
  optional: true,
  value: "ColumnMoveBeginFn<T>",
};

const ColumnMoveDragEndProp: PropertyType = {
  kind: "property",
  name: "columnMoveDragEnd",
  tsDoc: `Event fired when a column drag move operation finishes.`,
  doc: { en: `` },
  optional: true,
  value: "ColumnMoveEndFn<T>",
};

const ColumnMoveBeginProp: PropertyType = {
  kind: "property",
  name: "columnMoveBegin",
  tsDoc: `Event fired when a column move operation begins, not necessarily via drag.`,
  doc: { en: `` },
  optional: true,
  value: "ColumnMoveBeginFn<T>",
};

const ColumnMoveEndProp: PropertyType = {
  kind: "property",
  name: "columnMoveEnd",
  tsDoc: `Event fired when a column move operation completes.`,
  doc: { en: `` },
  optional: true,
  value: "ColumnMoveEndFn<T>",
};

export const Events: InterfaceType = {
  kind: "interface",
  name: "GridEvents<T>",
  tsDoc: `
    A comprehensive map of all possible events that LyteNyte Grid may emit during its lifecycle.

    @group Events
  `,
  doc: { en: ` ` },
  export: true,
  properties: [
    RowExpandBeginProp,
    RowExpandProp,
    RowExpandEnd,

    EditBeginProp,
    EditEndProp,
    EditCancelProp,
    EditErrorProp,

    RowDetailExpansionBeginProp,
    RowDetailExpansionEndProp,

    RowSelectBeginProp,
    RowSelectEndProp,
    RowSelectAllBeginProp,
    RowSelectAllEndProp,

    ColumnMoveDragBeginProp,
    ColumnMoveDragEndProp,
    ColumnMoveBeginProp,
    ColumnMoveEndProp,
  ],
};
