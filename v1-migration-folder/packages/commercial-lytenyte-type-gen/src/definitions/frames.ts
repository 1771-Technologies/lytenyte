import type { FunctionType, InterfaceType, PropertyType } from "../+types";
import { GridProp } from "./shared-properties";

const FrameContext: PropertyType = {
  kind: "property",
  doc: { en: `` },
  name: "context",
  optional: true,
  tsDoc: `Custom context data passed to the frame being rendered.

  This context is supplied programmatically at the point of invoking the frame.
  It can contain any arbitrary information required for rendering behavior.`,
  value: "any",
};

export const DialogFrameRendererParams: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  export: true,
  name: "DialogFrameRendererParams<T>",
  tsDoc: `Parameters provided to the dialog frame renderer function.

  These include the grid context, the frame being rendered, and any additional
  user-provided context.`,
  tag: "pro",
  properties: [
    GridProp,
    FrameContext,
    {
      kind: "property",
      doc: { en: `` },
      name: "frame",
      optional: false,
      tsDoc: `The dialog frame definition currently being rendered.`,
      value: "DialogFrame<T>",
    },
  ],
};

export const DialogFrameRenderer: FunctionType = {
  kind: "function",
  tsDoc: `Function responsible for rendering a dialog component.

  LyteNyte Grid does not provide a dialog component by default. Instead, it expects
  developers to use their preferred dialog libraries. This renderer function receives
  control parameters and should return a valid ReactNode to render as a dialog.

  Note: The dialog component used should support controlled open/close behavior.`,
  doc: { en: `` },
  export: true,
  name: "DialogFrameRenderer<T>",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      name: "params",
      optional: false,
      tsDoc: `Parameters passed into the renderer, including grid and frame info.`,
      value: "DialogFrameRendererParams<T>",
    },
  ],
  return: "ReactNode",
  tag: "pro",
};

export const DialogFrame: InterfaceType = {
  kind: "interface",
  tsDoc: `Defines a dialog frame configuration used by LyteNyte Grid.

  This structure is passed to grid internals to associate a rendering component
  for dialogs triggered by grid interactions.`,
  doc: { en: `` },
  export: true,
  name: "DialogFrame<T>",
  tag: "pro",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `Component renderer function to use for this dialog frame.`,
      name: "component",
      optional: false,
      value: "DialogFrameRenderer<T>",
    },
  ],
};

export const PopoverFrameRendererParams: InterfaceType = {
  kind: "interface",
  tsDoc: `Parameters passed to the popover frame renderer function.

  Includes information about the grid, the target HTML element or virtual
  target to anchor the popover, and the frame being rendered.`,
  doc: { en: `` },
  export: true,
  name: "PopoverFrameRendererParams<T>",
  tag: "pro",
  properties: [
    GridProp,
    FrameContext,
    {
      kind: "property",
      tsDoc: `The popover frame definition that should be rendered.`,
      doc: { en: `` },
      name: "frame",
      optional: false,
      value: "PopoverFrame<T>",
    },
    {
      kind: "property",
      tsDoc: `The target element or virtual position where the popover should be anchored.`,
      doc: { en: `` },
      name: "target",
      optional: false,
      value: "HTMLElement | VirtualTarget",
    },
  ],
};

export const PopoverFrameRenderer: FunctionType = {
  kind: "function",
  name: "PopoverFrameRenderer<T>",
  doc: { en: `` },
  tsDoc: `Function that renders a popover component for a given context.

  LyteNyte Grid does not include a built-in popover renderer. Developers must use their
  own popover UI libraries and integrate them by implementing this renderer interface.`,
  export: true,
  return: "ReactNode",
  tag: "pro",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `The parameters to be passed into the popover renderer.`,
      value: "PopoverFrameRendererParams<T>",
      name: "params",
    },
  ],
};

export const PopoverFrame: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  tsDoc: `Describes a popover frame and the component renderer used to display it.

  The popover frame is triggered by LyteNyte Grid interactions and used to display
  contextual information, editors, or auxiliary UI near a cell or element.`,
  export: true,
  name: "PopoverFrame<T>",
  tag: "pro",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      name: "component",
      optional: false,
      tsDoc: `Renderer function to generate the popover content.`,
      value: "PopoverFrameRenderer<T>",
    },
  ],
};
