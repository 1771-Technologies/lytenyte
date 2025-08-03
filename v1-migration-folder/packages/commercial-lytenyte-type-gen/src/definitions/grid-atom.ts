import type { InterfaceType, PropertyType } from "../+types";

const GetProperty: PropertyType = {
  kind: "property",
  name: "get",
  optional: false,
  value: "() => T",
  tsDoc: `Retrieves the current value stored in the atom. This method provides read access 
  to the state managed by the atom.`,
  doc: { en: `` },
};

const SetProperty: PropertyType = {
  kind: "property",
  name: "set",
  optional: false,
  value: "(v: T | ((p: T) => T)) => void",
  tsDoc: `Updates the atom's value. Accepts either a new value or a function that receives 
  the current value and returns the updated value.`,
  doc: { en: `` },
};

const WatchProperty: PropertyType = {
  kind: "property",
  name: "watch",
  optional: false,
  value: "(fn: () => void) => () => void",
  tsDoc: `Registers a listener function to be invoked whenever the atom's value changes. 
  Returns a cleanup function to remove the listener.`,
  doc: { en: `` },
};

const UseValueProperty: PropertyType = {
  kind: "property",
  name: "useValue",
  optional: false,
  value: "() => T",
  tsDoc: `A React hook that subscribes to the atom's value and causes the component to re-render 
  whenever the atom changes.`,
  doc: { en: `` },
};

export const GridAtom: InterfaceType = {
  kind: "interface",
  name: "GridAtom<T>",
  export: true,
  tsDoc: `Represents a mutable piece of reactive grid state. This atom allows reading, 
  updating, watching, and consuming its value reactively within React components.`,
  doc: { en: `` },
  properties: [GetProperty, SetProperty, WatchProperty, UseValueProperty],
};

export const GridAtomReadonly: InterfaceType = {
  kind: "interface",
  name: "GridAtomReadonly<T>",
  export: true,
  tsDoc: `Represents an immutable version of a grid atom that supports read, watch, and reactive 
  usage but does not allow updates.`,
  doc: { en: `` },
  properties: [GetProperty, WatchProperty, UseValueProperty],
};

export const GridAtomReadonlyUnwatchable: InterfaceType = {
  kind: "interface",
  name: "GridAtomReadonlyUnwatchable<T>",
  export: true,
  tsDoc: `Represents the most minimal read-only version of a grid atom. It supports value 
  retrieval and reactive consumption, but not watching or updates.`,
  doc: { en: `` },
  properties: [GetProperty, UseValueProperty],
};
