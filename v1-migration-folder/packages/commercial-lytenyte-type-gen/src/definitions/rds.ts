import type { InterfaceType } from "../+types";

export const RowDataStore: InterfaceType = {
  kind: "interface",
  name: "RowDataStore",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [
    {
      kind: "property",
      name: "rowCount",
      tsDoc: ``,
      doc: { en: `` },
      value: "GridAtomReadonly<number>",
      optional: false,
    },
    {
      kind: "property",
      name: "rowTopCount",
      tsDoc: ``,
      doc: { en: `` },
      value: "GridAtom<number>",
      optional: false,
    },
    {
      kind: "property",
      name: "rowCenterCount",
      tsDoc: ``,
      doc: { en: `` },
      value: "GridAtom<number>",
      optional: false,
    },
    {
      kind: "property",
      name: "rowBottomCount",
      tsDoc: ``,
      doc: { en: `` },
      value: "GridAtom<number>",
      optional: false,
    },
  ],
};

export const RowDataSourceCore: InterfaceType = {
  kind: "interface",
  name: "RowDataSource<T>",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [
    {
      kind: "property",
      name: "init",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "(grid: Grid<T>) => void",
    },
    {
      kind: "property",
      name: "rowById",
      value: "(id: string) => RowNode<T> | null",
      doc: { en: `` },
      tsDoc: ``,
      optional: false,
    },
    {
      kind: "property",
      name: "rowByIndex",
      value: "(index: number) => RowNode<T> | null",
      doc: { en: `` },
      tsDoc: ``,
      optional: false,
    },
  ],
  tag: "core",
};
