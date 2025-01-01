import { computed, signal, type ReadonlySignal, type Signal } from "@1771technologies/cascada";
import { useCascada } from "../src/cascada";
import type { CascadaStore } from "../src/types";
import { memo } from "react";

type Store = CascadaStore<{
  count: Signal<number>;
  indices: ReadonlySignal<number[]>;
  randoms: ReadonlySignal<number[]>;
}>;

export default function Selector() {
  const s = useCascada(() => {
    const count = signal(2);

    const indices = computed(() => {
      return Array.from({ length: count.get() }, (_, i) => i);
    });

    const randoms = computed(() => {
      return Array.from({ length: count.get() }, () => Math.random() * 200);
    });

    return { count, indices, randoms };
  });

  const count = s.useValue("indices");

  return (
    <>
      <button onClick={() => s.store.count.set((prev) => prev + 1)}>Increment</button>
      <button onClick={() => s.store.count.set((prev) => prev - 1)}>Decrement</button>
      <ul>
        {count.map((c) => {
          return (
            <li key={c}>
              <NodeWithSelector s={s} index={c} />
            </li>
          );
        })}
      </ul>
    </>
  );
}

const NodeWithSelector = memo(function NodeWithSelector({ s, index }: { s: Store; index: number }) {
  const v = s.useSelector((f) => {
    return f.randoms.get()[index] * 2;
  });

  return <div>X: {v}</div>;
});
