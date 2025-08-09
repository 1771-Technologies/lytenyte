import type { FunctionType, InterfaceType } from "../+types";
import { GridProp, RowNodeProp } from "./shared-properties";

export const GetDragDataParams: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  export: true,
  name: "GetDragDataParams<T>",
  properties: [GridProp, RowNodeProp],
  tsDoc: `Defines the input parameters for the function 
  that provides data during a drag operation.
  
  @group Row Drag
  `,
};

export const DragData: InterfaceType = {
  kind: "interface",
  name: "DragData",
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "siteLocalData",
      value: "Record<string, any>",
      optional: true,
      tsDoc: `Data that remains local to the site and is 
      not transferred via the drag event's DataTransfer object.`,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "dataTransfer",
      optional: true,
      tsDoc: `String-based key-value pairs to be transferred with the drag event.`,
      doc: { en: `` },
      value: "Record<string, string>",
    },
  ],
  tsDoc: `Contains data associated with a drag operation, 
  including transferable and site-local information.
  
  @group Row Drag
  `,
};

export const GetDragDataFn: FunctionType = {
  kind: "function",
  doc: { en: `` },
  tsDoc: `Function used to provide the data that will be associated with a drag operation.
  
  @group Row Drag
  `,
  export: true,
  name: "GetDragDataFn<T>",
  properties: [
    {
      kind: "property",
      name: "params",
      doc: { en: `` },
      optional: false,
      tsDoc: `Parameters passed to the function that generates drag data.`,
      value: "GetDragDataParams<T>",
    },
  ],
  return: "DragData",
};

export const DragPosition: InterfaceType = {
  kind: "interface",
  name: "DragPosition",
  doc: { en: `` },
  tsDoc: `Represents the current pointer position during a drag operation.
  
  @group Row Drag
  `,
  export: true,
  properties: [
    {
      kind: "property",
      name: "x",
      doc: { en: `` },
      optional: false,
      tsDoc: `Client X coordinate.`,
      value: "number",
    },
    {
      kind: "property",
      name: "y",
      doc: { en: `` },
      optional: false,
      tsDoc: `Client Y coordinate.`,
      value: "number",
    },
  ],
};

export const DragEventParams: InterfaceType = {
  kind: "interface",
  name: "DragEventParams",
  doc: { en: `` },
  tsDoc: `Arguments passed during a drag event lifecycle.
  
  @group Row Drag
  `,
  export: true,
  properties: [
    {
      kind: "property",
      name: "state",
      doc: { en: `` },
      tsDoc: `Current drag state data.`,
      optional: false,
      value: "DragData",
    },
    {
      kind: "property",
      name: "position",
      doc: { en: `` },
      tsDoc: `Current cursor position during the drag.`,
      optional: false,
      value: "DragPosition",
    },
    {
      kind: "property",
      name: "dragElement",
      doc: { en: `` },
      tsDoc: `The HTML element currently being dragged.`,
      optional: false,
      value: "HTMLElement",
    },
  ],
};

export const DragEventFn: FunctionType = {
  kind: "function",
  name: "DragEventFn",
  export: true,
  doc: { en: `` },
  tsDoc: `Callback function executed during a drag event.
  
  @group Row Drag
  `,
  return: "void",
  properties: [
    {
      kind: "property",
      name: "params",
      doc: { en: `` },
      optional: false,
      tsDoc: `Arguments received during the drag event.`,
      value: "DragEventParams",
    },
  ],
};

export const DropMoveState: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  tsDoc: `Describes the final state of a drag-and-drop move operation.
  
  @group Row Drag
  `,
  export: true,
  name: "DragMoveState",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Indicates if the drag was initiated via keyboard.`,
      name: "isKeyboard",
      value: "boolean",
      optional: false,
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `X coordinate of the drop.`,
      name: "x",
      value: "number",
      optional: false,
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Y coordinate of the drop.`,
      name: "y",
      value: "number",
      optional: false,
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Element into which the drag was dropped.`,
      name: "dropElement",
      value: "HTMLElement",
      optional: false,
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Element that was being dragged.`,
      name: "dragElement",
      value: "HTMLElement",
      optional: false,
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Bounding rectangle of the drop target.`,
      name: "rect",
      value: "DOMRect",
      optional: false,
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `True if the drop occurred in the top half of the element.`,
      name: "topHalf",
      value: "boolean",
      optional: false,
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `True if the drop occurred in the left half of the element.`,
      name: "leftHalf",
      value: "boolean",
      optional: false,
    },
  ],
};

export const DropEventParams: InterfaceType = {
  kind: "interface",
  name: "DropEventParams",
  doc: { en: `` },
  tsDoc: `
  Represents the full context passed to the drop event handler.

  @group Row Drag
  `,
  export: true,
  properties: [
    {
      kind: "property",
      name: "state",
      doc: { en: `` },
      tsDoc: `The drag data at the time of drop.`,
      optional: false,
      value: "DragData",
    },
    {
      kind: "property",
      name: "moveState",
      doc: { en: `` },
      tsDoc: `Details the last-known drag position and target info before drop.`,
      optional: false,
      value: "DragMoveState",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `The HTML element onto which the drop occurred.`,
      name: "dropElement",
      value: "HTMLElement",
      optional: false,
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `The HTML element that was dragged.`,
      name: "dragElement",
      value: "HTMLElement",
      optional: false,
    },
  ],
};

export const DropEventFn: FunctionType = {
  kind: "function",
  tsDoc: `
  Fired when a drop action is finalized and the dragged element is released over a drop zone.
  
  @group Row Drag
  `,
  doc: { en: `` },
  export: true,
  name: "DropEventFn",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      name: "params",
      optional: false,
      tsDoc: `The parameters passed to the drop event function.`,
      value: "DropEventParams",
    },
  ],
  return: "void",
};

export const DragPlaceholderParams: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  tsDoc: `
  Parameters passed when rendering the drag placeholder content.
  
  @group Row Drag
  `,
  export: true,
  name: "DragPlaceholderParams<T>",
  properties: [
    GridProp,
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `The data associated with the current drag session.`,
      name: "dragData",
      optional: false,
      value: "DragData",
    },
  ],
};

export const DragPlaceholderFn: FunctionType = {
  kind: "function",
  doc: { en: `` },
  tsDoc: `Function to render the drag placeholder UI. This UI 
  is rendered in isolation and does not respond to app state changes.
  
  @group Row Drag
  `,
  export: true,
  name: "DragPlaceholderFn<T>",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Parameters for rendering the placeholder.`,
      name: "params",
      optional: false,
      value: "DragPlaceholderParams<T>",
    },
  ],
  return: "ReactNode",
};

export const UseRowDragParams: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  tsDoc: `
  Parameters for configuring drag behavior using a React hook.
  
  @group Row Drag
  `,
  export: true,
  name: "UseRowDragParams<T>",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      name: "getDragData",
      optional: false,
      tsDoc: `Function to compute the drag payload when dragging begins.`,
      value: "GetDragDataFn<T>",
    },
    {
      kind: "property",
      name: "onDragMove",
      doc: { en: `` },
      tsDoc: `Invoked frequently as the drag position updates.`,
      optional: true,
      value: "DragEventFn",
    },
    {
      kind: "property",
      name: "onDragStart",
      doc: { en: `` },
      tsDoc: `Called at the beginning of a drag operation.`,
      optional: true,
      value: "DragEventFn",
    },
    {
      kind: "property",
      name: "onDragEnd",
      doc: { en: `` },
      tsDoc: `Called at the end of a drag operation, regardless of drop.`,
      optional: true,
      value: "DragEventFn",
    },
    {
      kind: "property",
      name: "onDrop",
      doc: { en: `` },
      tsDoc: `Triggered when the drag results in a drop.`,
      optional: true,
      value: "DropEventFn",
    },
    {
      kind: "property",
      tsDoc: `Function to generate placeholder content for the drag preview.`,
      doc: { en: `` },
      name: "placeholder",
      optional: true,
      value: "DragPlaceholderFn<T>",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Offset [x, y] in pixels from the cursor position for rendering the drag placeholder.`,
      value: "[number, number]",
      optional: true,
      name: "placeholderOffset",
    },
    {
      kind: "property",
      name: "keyActivate",
      tsDoc: `Keyboard key used to initiate drag mode.`,
      doc: { en: `` },
      optional: true,
      value: "string",
    },
    {
      kind: "property",
      name: "keyNext",
      tsDoc: `Keyboard key used to move to the next drop zone.`,
      doc: { en: `` },
      optional: true,
      value: "string",
    },
    {
      kind: "property",
      name: "keyPrev",
      tsDoc: `Keyboard key used to move to the previous drop zone.`,
      doc: { en: `` },
      optional: true,
      value: "string",
    },
    {
      kind: "property",
      name: "keyDrop",
      tsDoc: `Keyboard key used to execute the drop.`,
      doc: { en: `` },
      optional: true,
      value: "string",
    },
    {
      kind: "property",
      name: "dragInstructions",
      tsDoc: `Accessible label describing how to perform the drag operation.`,
      doc: { en: `` },
      optional: true,
      value: "string",
    },
    {
      kind: "property",
      name: "announceDragStart",
      tsDoc: `Screen reader message to announce drag start.`,
      doc: { en: `` },
      optional: true,
      value: "string",
    },
    {
      kind: "property",
      name: "announceDragEnd",
      tsDoc: `Screen reader message to announce drag end.`,
      doc: { en: `` },
      optional: true,
      value: "string",
    },
  ],
};
