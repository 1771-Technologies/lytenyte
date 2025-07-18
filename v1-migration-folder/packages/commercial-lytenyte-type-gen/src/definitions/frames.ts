import type { FunctionType, InterfaceType, PropertyType } from "../+types";
import { GridProp } from "./shared-properties";

const FrameContext: PropertyType = {
  kind: "property",
  doc: { en: `` },
  name: "context",
  optional: true,
  tsDoc: ``,
  value: "any",
};

export const DialogFrameRendererParams: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  export: true,
  name: "DialogFrameRendererParams<T>",
  tsDoc: ``,
  tag: "pro",
  properties: [
    GridProp,
    FrameContext,
    {
      kind: "property",
      doc: { en: `` },
      name: "frame",
      optional: false,
      tsDoc: ``,
      value: "DialogFrame<T>",
    },
  ],
};

export const DialogFrameRenderer: FunctionType = {
  kind: "function",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  name: "DialogFrameRenderer<T>",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      name: "params",
      optional: false,
      tsDoc: ``,
      value: "DialogFrameRendererParams<T>",
    },
  ],
  return: "ReactNode",
  tag: "pro",
};

export const DialogFrame: InterfaceType = {
  kind: "interface",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  name: "DialogFrame<T>",
  tag: "pro",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "component",
      optional: false,
      value: "DialogFrameRenderer<T>",
    },
  ],
};

export const PopoverFrameRendererParams: InterfaceType = {
  kind: "interface",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  name: "PopoverFrameRendererParams<T>",
  tag: "pro",
  properties: [
    GridProp,
    FrameContext,
    {
      kind: "property",
      tsDoc: ``,
      doc: { en: `` },
      name: "frame",
      optional: false,
      value: "PopoverFrame<T>",
    },
  ],
};

export const PopoverFrameRenderer: FunctionType = {
  kind: "function",
  name: "PopoverFrameRenderer<T>",
  doc: { en: `` },
  tsDoc: ``,
  export: true,
  return: "ReactNode",
  tag: "pro",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      value: "PopoverFrameRendererParams<T>",
      name: "params",
    },
  ],
};

export const PopoverFrame: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  tsDoc: ``,
  export: true,
  name: "PopoverFrame<T>",
  tag: "pro",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      name: "component",
      optional: false,
      tsDoc: ``,
      value: "PopoverFrameRenderer<T>",
    },
  ],
};
