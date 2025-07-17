import type { InterfaceType, InterfaceTypePartial } from "../+types";
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

export const RowSelectParams: InterfaceType = {
  kind: "interface",
  name: "RdsRowSelectParams",
  doc: { en: `` },
  export: true,
  tsDoc: ``,
  properties: [
    {
      kind: "property",
      name: "startId",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      value: "string",
    },
    {
      kind: "property",
      name: "endId",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      value: "string",
    },
    {
      kind: "property",
      name: "selectChildren",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      value: "boolean",
    },
    {
      kind: "property",
      name: "deselect",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      value: "boolean",
    },
    {
      kind: "property",
      name: "mode",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      value: "RowSelectionMode",
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

export const RowDataSourcePartial: InterfaceTypePartial = {
  kind: "interface-partial",
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
      name: "rowToIndex",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
      value: "(rowId: string) => number | null",
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
    {
      kind: "property",
      name: "rowSelect",
      value: "(params: RdsRowSelectParams) => void",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
    },
    {
      kind: "property",
      name: "rowSelectAll",
      value: "(params: RowSelectAllOptions) => void",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
    },
    {
      kind: "property",
      name: "rowAllChildIds",
      value: "(rowId: string) => string[]",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
    },
  ],
};

export const RowDataSourceCore: InterfaceType = {
  kind: "interface",
  name: "RowDataSource<T>",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [],
  extends: RowDataSourcePartial,
  tag: "core",
};

export const RowDataSourceClient: InterfaceType = {
  kind: "interface",
  name: "RowDataSourceClient<T>",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [],
  extends: RowDataSourcePartial,
};

export const RowDataSourceClientPageState: InterfaceType = {
  kind: "interface",
  name: "RowDataSourceClientPageState",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "current",
      optional: false,
      value: "GridAtom<number>",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "perPage",
      optional: false,
      value: "GridAtom<number>",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "pageCount",
      optional: false,
      value: "GridAtomReadonly<number>",
    },
  ],
};

export const RowDataSourceClientClientPaginated: InterfaceType = {
  kind: "interface",
  name: "RowDataSourceClientPaginated<T>",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  extends: RowDataSourcePartial,
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: ``,
      name: "page",
      optional: false,
      value: "RowDataSourceClientPageState",
    },
  ],
};
