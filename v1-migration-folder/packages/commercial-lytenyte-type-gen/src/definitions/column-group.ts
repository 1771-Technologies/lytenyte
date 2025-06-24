import type { InterfaceType, UnionType } from "../+types";

export const ColumnGroupMeta: InterfaceType = {
  kind: "interface",
  name: "ColumnGroupMeta",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [
    {
      kind: "property",
      name: "colIdToGroupIds",
      value: "Map<string, string[]>",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
    },
    {
      kind: "property",
      name: "validGroupIds",
      value: "Set<string>",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
    },
    {
      kind: "property",
      name: "groupIsCollapsible",
      value: "Map<string, boolean>",
      doc: { en: `` },
      optional: false,
      tsDoc: ``,
    },
  ],
};

export const ColumnGroupVisibility: UnionType = {
  kind: "union",
  name: "ColumnGroupVisibility",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  types: ['"always"', '"close"', '"open"'],
};
