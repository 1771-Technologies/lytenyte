import { signal } from "@1771technologies/cascada";
import { useCascada } from "../src/cascada";

export default function SelectorSimple() {
  const s = useCascada(() => {
    const x = signal(0);
    return { x };
  });

  const v = s.useSelector((c) => c.x.get());

  return (
    <div>
      <button onClick={() => s.store.x.set((prev) => prev + 1)}>ON</button>
      {v}
    </div>
  );
}
