import type { InterfaceType, PropertyType } from "../+types";

const GetProperty: PropertyType = {
  kind: "property",
  name: "get",
  optional: false,
  value: "() => T",
  tsDoc: ``,
  doc: { en: `` },
};
const SetProperty: PropertyType = {
  kind: "property",
  name: "set",
  optional: false,
  value: "(v: T | ((p: T) => T)) => void",
  tsDoc: ``,
  doc: { en: `` },
};
const WatchProperty: PropertyType = {
  kind: "property",
  name: "watch",
  optional: false,
  value: "(fn: () => void) => () => void",
  tsDoc: ``,
  doc: { en: `` },
};
const UseValueProperty: PropertyType = {
  kind: "property",
  name: "useValue",
  optional: false,
  value: "() => T",
  tsDoc: ``,
  doc: { en: `` },
};

export const GridAtom: InterfaceType = {
  kind: "interface",
  name: "GridAtom<T>",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [GetProperty, SetProperty, WatchProperty, UseValueProperty],
};

export const GridAtomReadonly: InterfaceType = {
  kind: "interface",
  name: "GridAtomReadonly<T>",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [GetProperty, WatchProperty, UseValueProperty],
};

export const GridAtomReadonlyUnwatchable: InterfaceType = {
  kind: "interface",
  name: "GridAtomReadonlyUnwatchable<T>",
  export: true,
  tsDoc: ``,
  doc: { en: `` },
  properties: [GetProperty, UseValueProperty],
};
