import type { FunctionType, InterfaceType } from "../+types";
import { GridProp, RowNodeProp } from "./shared-properties";

export const GetDragDataParams: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  export: true,
  name: "GetDragDataParams<T>",
  properties: [GridProp, RowNodeProp],
  tsDoc: ``,
};

export const DragData: InterfaceType = {
  kind: "interface",
  name: "DragData",
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      name: "siteLocalData",
      value: "Record<string, any>",
      optional: true,
      tsDoc: ``,
    },
    {
      kind: "property",
      doc: { en: `` },
      name: "dataTransfer",
      optional: true,
      tsDoc: ``,
      value: "Record<string, string>",
    },
  ],
  tsDoc: ``,
};

export const GetDragDataFn: FunctionType = {
  kind: "function",
  doc: { en: `` },
  tsDoc: ``,
  export: true,
  name: "GetDragDataFn<T>",
  properties: [
    {
      kind: "property",
      name: "params",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      value: "GetDragDataParams<T>",
    },
  ],
  return: "DragData",
};

export const DragPosition: InterfaceType = {
  kind: "interface",
  name: "DragPosition",
  doc: { en: `` },
  tsDoc: ``,
  export: true,
  properties: [
    { kind: "property", name: "x", doc: { en: `` }, optional: false, tsDoc: ``, value: "number" },
    { kind: "property", name: "y", doc: { en: `` }, optional: false, tsDoc: ``, value: "number" },
  ],
};
export const DragEventParams: InterfaceType = {
  kind: "interface",
  name: "DragEventParams",
  doc: { en: `` },
  tsDoc: ``,
  export: true,
  properties: [
    {
      kind: "property",
      name: "state",
      doc: { en: `` },
      tsDoc: ``,
      optional: false,
      value: "DragData",
    },
    {
      kind: "property",
      name: "position",
      doc: { en: `` },
      tsDoc: ``,
      optional: false,
      value: "DragPosition",
    },
    {
      kind: "property",
      name: "dragElement",
      doc: { en: `` },
      tsDoc: ``,
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
  tsDoc: ``,
  return: "void",
  properties: [
    {
      kind: "property",
      name: "params",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      value: "DragEventParams",
    },
  ],
};

export const DropMoveState: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  tsDoc: ``,
  export: true,
  name: "DragMoveState",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "isKeyboard",
      value: "boolean",
      optional: false,
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "x",
      value: "number",
      optional: false,
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "y",
      value: "number",
      optional: false,
    },

    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "dropElement",
      value: "HTMLElement",
      optional: false,
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "dragElement",
      value: "HTMLElement",
      optional: false,
    },

    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "rect",
      value: "DOMRect",
      optional: false,
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "topHalf",
      value: "boolean",
      optional: false,
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
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
  tsDoc: ``,
  export: true,
  properties: [
    {
      kind: "property",
      name: "state",
      doc: { en: `` },
      tsDoc: ``,
      optional: false,
      value: "DragData",
    },
    {
      kind: "property",
      name: "moveState",
      doc: { en: `` },
      tsDoc: ``,
      optional: false,
      value: "DragMoveState",
    },

    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "dropElement",
      value: "HTMLElement",
      optional: false,
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "dragElement",
      value: "HTMLElement",
      optional: false,
    },
  ],
};

export const DropEventFn: FunctionType = {
  kind: "function",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  name: "DropEventFn",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      name: "params",
      optional: false,
      tsDoc: ``,
      value: "DropEventParams",
    },
  ],
  return: "void",
};

export const DragPlaceholderParams: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  tsDoc: ``,
  export: true,
  name: "DragPlaceholderParams<T>",
  properties: [
    GridProp,
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "dragData",
      optional: false,
      value: "DragData",
    },
  ],
};
export const DragPlaceholderFn: FunctionType = {
  kind: "function",
  doc: { en: `` },
  tsDoc: ``,
  export: true,
  name: "DragPlaceholderFn<T>",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
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
  tsDoc: ``,
  export: true,
  name: "UseRowDragParams<T>",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      name: "getDragData",
      optional: false,
      tsDoc: ``,
      value: "GetDragDataFn<T>",
    },

    {
      kind: "property",
      name: "onDragMove",
      doc: { en: `` },
      tsDoc: ``,
      optional: true,
      value: "DragEventFn",
    },
    {
      kind: "property",
      name: "onDragStart",
      doc: { en: `` },
      tsDoc: ``,
      optional: true,
      value: "DragEventFn",
    },
    {
      kind: "property",
      name: "onDragEnd",
      doc: { en: `` },
      tsDoc: ``,
      optional: true,
      value: "DragEventFn",
    },
    {
      kind: "property",
      name: "onDrop",
      doc: { en: `` },
      tsDoc: ``,
      optional: true,
      value: "DropEventFn",
    },

    {
      kind: "property",
      tsDoc: ``,
      doc: { en: `` },
      name: "placeholder",
      optional: true,
      value: "DragPlaceholderFn<T>",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      value: "[number, number]",
      optional: true,
      name: "placeholderOffset",
    },

    {
      kind: "property",
      name: "keyActivate",
      tsDoc: ``,
      doc: { en: `` },
      optional: true,
      value: "string",
    },
    {
      kind: "property",
      name: "keyNext",
      tsDoc: ``,
      doc: { en: `` },
      optional: true,
      value: "string",
    },
    {
      kind: "property",
      name: "keyPrev",
      tsDoc: ``,
      doc: { en: `` },
      optional: true,
      value: "string",
    },
    {
      kind: "property",
      name: "keyDrop",
      tsDoc: ``,
      doc: { en: `` },
      optional: true,
      value: "string",
    },
    {
      kind: "property",
      name: "dragInstructions",
      tsDoc: ``,
      doc: { en: `` },
      optional: true,
      value: "string",
    },
    {
      kind: "property",
      name: "announceDragStart",
      tsDoc: ``,
      doc: { en: `` },
      optional: true,
      value: "string",
    },
    {
      kind: "property",
      name: "announceDragEnd",
      tsDoc: ``,
      doc: { en: `` },
      optional: true,
      value: "string",
    },
  ],
};
