import type { InterfaceType } from "../+types";

export const GridCore: InterfaceType = {
  kind: "interface",
  name: "Grid<T>",
  export: true,
  tag: "core",
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
  ],
};
