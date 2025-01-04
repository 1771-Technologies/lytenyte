import { computed, remote } from "@1771technologies/cascada";
import { useCascada } from "../src/cascada.js";

let mouseDowns = 0;
const subs = new Set<() => void>();
const remoteValue = {
  get: () => mouseDowns,
  subscribe: (fn: () => void) => {
    subs.add(fn);

    return () => {
      subs.delete(fn);
    };
  },
};

if (typeof document !== "undefined")
  document.addEventListener("mousedown", () => {
    mouseDowns++;
    subs.forEach((c) => c());
  });

export default function RemotePlay() {
  const s = useCascada(() => {
    const r = remote(remoteValue);

    const c = computed(() => r.get() * 2);

    return { c, r };
  });

  const mouseDowns = s.useValue("r");
  const cValue = s.useValue("c");

  return (
    <div>
      Mouse Downs: {mouseDowns}. downs * 2 === {cValue}
    </div>
  );
}
