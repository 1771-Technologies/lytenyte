import type { InterfaceType, PropertyType } from "../+types";

const FieldForColumn: PropertyType = {
  kind: "property",
  name: "fieldForColumn",
  tsDoc: ``,
  value: "(columnOrId: string | Column<T>, row: FieldDataParam<T>) => unknown",
  doc: { en: `` },
  optional: false,
};

const SortForColumn: PropertyType = {
  kind: "property",
  name: "sortForColumn",
  tsDoc: ``,
  doc: { en: `` },
  value: "(columnOrId: string) => { sort: SortModelItem<T>, index: number } | null",
  optional: false,
};

const RowIsLeaf: PropertyType = {
  kind: "property",
  name: "rowIsLeaf",
  tsDoc: ``,
  doc: { en: `` },
  value: "(row: RowNode<T>) => row is RowLeaf<T>",
  optional: false,
};
const RowIsGroup: PropertyType = {
  kind: "property",
  name: "rowIsGroup",
  tsDoc: ``,
  doc: { en: `` },
  value: "(row: RowNode<T>) => row is RowGroup",
  optional: false,
};
const RowGroupColumnIndex: PropertyType = {
  kind: "property",
  name: "rowGroupColumnIndex",
  tsDoc: ``,
  doc: { en: `` },
  value: "(c: Column<T>) => number",
  optional: false,
};
const RowGroupToggleExpansion: PropertyType = {
  kind: "property",
  name: "rowGroupToggle",
  tsDoc: ``,
  doc: { en: `` },
  value: "(row: RowGroup, state?: boolean) => void",
  optional: false,
};
const RowGroupApplyExpansions: PropertyType = {
  kind: "property",
  name: "rowGroupApplyExpansions",
  tsDoc: ``,
  doc: { en: `` },
  value: "(expansions: Record<string, boolean>) => void",
  optional: false,
};
const RowGroupIsExpanded: PropertyType = {
  kind: "property",
  name: "rowGroupIsExpanded",
  tsDoc: ``,
  doc: { en: `` },
  value: "(row: RowGroup) => boolean",
  optional: false,
};

const EventAddListener: PropertyType = {
  kind: "property",
  name: "eventAddListener",
  doc: { en: `` },
  tsDoc: ``,
  optional: false,
  value:
    "<K extends keyof GridEvents<T>>(event: K, fn: (event: Parameters<Required<GridEvents<T>>[K]>[0]) => void) => () => void",
};

const EventRemoveListener: PropertyType = {
  kind: "property",
  name: "eventRemoveListener",
  doc: { en: `` },
  tsDoc: ``,
  optional: false,
  value:
    "<K extends keyof GridEvents<T>>(event: K, fn: (event: Parameters<Required<GridEvents<T>>[K]>[0]) => void) => void",
};
const EventFire: PropertyType = {
  kind: "property",
  name: "eventFire",
  doc: { en: `` },
  tsDoc: ``,
  optional: false,
  value:
    "<K extends keyof GridEvents<T>>(name: K, event: Parameters<Required<GridEvents<T>>[K]>[0]) => void",
};

export const ScrollIntoViewOptions: InterfaceType = {
  kind: "interface",
  name: "ScrollIntoViewOptions<T>",
  doc: { en: `` },
  tsDoc: ``,
  export: true,
  properties: [
    {
      kind: "property",
      name: "column",
      value: "number | string | Column<T>",
      doc: { en: `` },
      optional: true,
      tsDoc: ``,
    },
    {
      kind: "property",
      name: "row",
      value: "number",
      doc: { en: `` },
      optional: true,
      tsDoc: ``,
    },
    {
      kind: "property",
      name: "behavior",
      value: '"smooth" | "auto" | "instant"',
      doc: { en: `` },
      tsDoc: ``,
      optional: true,
    },
  ],
};

const ScrollIntoView: PropertyType = {
  kind: "property",
  name: "scrollIntoView",
  doc: { en: `` },
  tsDoc: ``,
  optional: false,
  value: "(options: ScrollIntoViewOptions<T>) => void",
};

export const GridApi: InterfaceType = {
  kind: "interface",
  name: "GridApi<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    FieldForColumn,
    SortForColumn,
    RowIsLeaf,
    RowIsGroup,
    RowGroupColumnIndex,
    RowGroupToggleExpansion,
    RowGroupApplyExpansions,
    RowGroupIsExpanded,

    EventAddListener,
    EventRemoveListener,
    EventFire,

    ScrollIntoView,
  ],
};
