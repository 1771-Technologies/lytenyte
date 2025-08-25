import type { Computed, LayoutDiffers } from "./update-layout";

export interface LayoutState {
  readonly computed: Computed;
  readonly special: LayoutDiffers;
  readonly lookup: Map<number, Int32Array>;
  readonly base: Uint32Array;
}

export function makeLayoutState(columnCount: number, n: number = 50_000): LayoutState {
  const base = new Uint32Array(columnCount * 4);
  for (let i = 0; i < columnCount; i++) {
    const ci = i * 4;
    base[ci] = 1;
    base[ci + 1] = 1;
  }

  return {
    computed: new Uint8Array(Math.max(n, 50_000)),
    special: new Uint8Array(Math.max(n, 50_000)),
    lookup: new Map(),
    base,
  };
}
