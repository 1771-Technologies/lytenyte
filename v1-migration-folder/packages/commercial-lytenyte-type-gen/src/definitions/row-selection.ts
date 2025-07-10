import type { UnionType } from "../+types";

export const RowSelectionMode: UnionType = {
  kind: "union",
  name: "RowSelectionMode",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  types: ['"single"', '"multiple"', '"none"'],
};
export const RowSelectionCheckbox: UnionType = {
  kind: "union",
  name: "RowSelectionCheckbox",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  types: ['"normal"', '"hide"'],
};

export const RowSelectionActivator: UnionType = {
  kind: "union",
  name: "RowSelectionPointerActivator",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  types: ['"single"', '"dbl-click"', '"none"'],
};
