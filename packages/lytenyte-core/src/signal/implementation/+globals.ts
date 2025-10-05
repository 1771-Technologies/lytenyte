import type { Computation, ContextRecord, Scope } from "./+types.js";

interface Global {
  scheduledEffects: boolean;
  runningEffects: boolean;
  currentScope: Scope | null;
  currentObserver: Computation | null;
  currentObservers: Computation[] | null;
  currentObserversIndex: number;
  effects: Computation[];
  defaultContext: ContextRecord;
}
export const G: Global = {
  scheduledEffects: false,
  runningEffects: false,
  currentScope: null,
  currentObserver: null,
  currentObservers: null,
  currentObserversIndex: 0,
  effects: [],
  defaultContext: {},
};
