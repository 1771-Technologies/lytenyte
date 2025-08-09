import type { InterfaceType } from "../+types";

export const Grid: InterfaceType = {
  kind: "interface",
  name: "Grid<T>",
  export: true,
  tsDoc: `The grid object encapsulates the full LyteNyte Grid instance, including its state, view, and imperative API.
  It is returned by the \`useLyteNyte\` hook and serves as the primary interface for interacting with the grid programmatically.
  
  @group Grid State
  `,
  doc: { en: `` },
  properties: [
    {
      kind: "property",
      name: "state",
      value: "GridState<T>",
      tsDoc: `The declarative state of LyteNyte Grid. This contains all core 
      and optional features represented as atoms.`,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "view",
      value: "GridAtomReadonly<GridView<T>>",
      tsDoc: `The current layout view of the grid, reflecting visible headers and rows 
      based on virtualization and scroll position.`,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "api",
      value: "GridApi<T>",
      tsDoc: `The imperative API of LyteNyte Grid for triggering actions such 
      as column resizing, row expansion, and selection.`,
      doc: { en: `` },
      optional: false,
    },
  ],
};
