import { signal } from "@1771technologies/cascada";
import { useCascada } from "../src/cascada";

export default function Play() {
  const { store, use } = useCascada(() => {
    const count = signal(0);
    return { count };
  });

  const count = useValue("count");

  return (
    <div>
      <button onClick={() => store.count.set((prev) => prev + 1)}>
        I've been clicked {count} times{" "}
      </button>
    </div>
  );
}
