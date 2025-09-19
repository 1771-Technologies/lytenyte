import { SCOPE } from "../+constants.js";
import type { WriteSignal } from "../+types";
import { signal } from "../vanilla/index.js";

type ValueOrSignal<K extends Record<string, any>> = {
  [key in keyof K]: K[key] | WriteSignal<K[key]>;
};

export function makeStore<K extends Record<string, any>>(
  props: Partial<ValueOrSignal<K>>,
  defaults: K,
): {
  [key in keyof K]: WriteSignal<K[key]>;
} {
  const entries = Object.entries(defaults);

  return Object.fromEntries(
    entries.map(([key, defaultValue]) => {
      const propValue = props[key];

      if (propValue && propValue[SCOPE]) return [key, propValue];

      return [key, signal(propValue ?? defaultValue)];
    }),
  ) as {
    [key in keyof K]: WriteSignal<K[key]>;
  };
}
