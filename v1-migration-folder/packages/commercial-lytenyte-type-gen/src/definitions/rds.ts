import type { InterfaceType } from "../+types";
import { RowIndexProp } from "./shared-properties";

export const RowUpdateParams: InterfaceType = {
  kind: "interface",
  name: "RowUpdateParams",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    RowIndexProp,
    {
      kind: "property",
      name: "data",
      doc: { en: `` },
      tsDoc: ``,
      optional: false,
      value: "any",
    },
  ],
};

export const RowDataStore: InterfaceType = {
  kind: "interface",
  name: "RowDataStore<T>",
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
    {
      kind: "property",
      name: "rowForIndex",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "(row: number) => GridAtomReadonlyUnwatchable<RowNode<T> | null>",
    },
    {
      kind: "property",
      name: "rowClearCache",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "() => void",
    },
    {
      kind: "property",
      name: "rowInvalidateIndex",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "(row: number) => void",
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
    {
      kind: "property",
      name: "rowUpdate",
      value: "(params: RowUpdateParams) => void",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
    },
    {
      kind: "property",
      name: "rowExpand",
      value: "(expansion: Record<string, boolean>) => void",
      doc: { en: `` },
      tsDoc: ``,
      optional: false,
    },
  ],
  tag: "core",
};
