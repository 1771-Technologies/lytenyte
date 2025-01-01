import { computed, signal, type ReadonlySignal, type Signal } from "@1771technologies/cascada";
import { useCascada } from "../src/cascada";
import type { CascadaStore } from "../src/types";
import { useRef } from "react";

type Store = {
  x: Signal<number>;
  y: Signal<number>;
  t: ReadonlySignal<number>;
  z: ReadonlySignal<number>;
};

export default function Computed() {
  const s = useCascada(() => {
    const x = signal(0);
    const y = signal(0);
    const t = computed(() => x.get() * 2);
    const z = computed(() => x.get() + y.get());

    return { x, y, t, z };
  });

  return (
    <div>
      <button
        onClick={() => {
          s.store.x.set((prev) => prev + 1);
        }}
      >
        Increment X
      </button>
      <button onClick={() => s.store.y.set((prev) => prev + 1)}>Increment Y</button>
      <TNode s={s} />
      <ZNode s={s} />
    </div>
  );
}

function TNode({ s }: { s: CascadaStore<Store> }) {
  const count = s.useValue("t");
  const ref = useRef(0);
  ref.current++;
  return (
    <div>
      T Count: {count}. I've rendered: {ref.current} times
    </div>
  );
}

function ZNode({ s }: { s: CascadaStore<Store> }) {
  const pos = s.useValue("z");

  const ref = useRef(0);
  ref.current++;

  return (
    <div>
      Z Count: {pos}. I've rendered: {ref.current} times
    </div>
  );
}
