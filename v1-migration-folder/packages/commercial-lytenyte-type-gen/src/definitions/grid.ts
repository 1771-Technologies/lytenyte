import type { InterfaceType } from "../+types";

export const Grid: InterfaceType = {
  kind: "interface",
  name: "Grid<T>",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [
    {
      kind: "property",
      name: "state",
      value: "GridState<T>",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "view",
      value: "GridAtomReadonly<GridView<T>>",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "api",
      value: "GridApi<T>",
      doc: { en: `` },
      tsDoc: ``,
      optional: false,
    },
  ],
};
