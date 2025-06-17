import type { InterfaceType } from "../+types";

export const GridAtom: InterfaceType = {
  kind: "interface",
  name: "GridAtom<T>",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [
    {
      kind: "property",
      name: "get",
      optional: false,
      value: "() => T",
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "set",
      optional: false,
      value: "(v: T | ((p: T) => T)) => void",
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "watch",
      optional: false,
      value: "(fn: () => void) => () => void",
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "useValue",
      optional: false,
      value: "() => T",
      tsDoc: ``,
      doc: { en: `` },
    },
  ],
};

export const GridAtomReadonly: InterfaceType = {
  kind: "interface",
  name: "GridAtomReadonly<T>",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [
    {
      kind: "property",
      name: "get",
      optional: false,
      value: "() => T",
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "watch",
      optional: false,
      value: "(fn: () => void) => () => void",
      tsDoc: ``,
      doc: { en: `` },
    },
    {
      kind: "property",
      name: "useValue",
      optional: false,
      value: "() => T",
      tsDoc: ``,
      doc: { en: `` },
    },
  ],
};
