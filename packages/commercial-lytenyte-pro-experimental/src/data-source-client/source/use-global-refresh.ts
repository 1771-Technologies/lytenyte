import { createSignal, type Signal } from "@1771technologies/lytenyte-core-experimental/internal";
import { useRef } from "react";

export function useGlobalRefresh() {
  const globalSignal = useRef<Signal<number>>(null as any);
  if (!globalSignal.current) {
    globalSignal.current = createSignal(0);
  }

  return globalSignal.current;
}
