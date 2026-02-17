import { useRef } from "react";
import { createSignal, type Signal } from "../signal/signal.js";

export function useGlobalRefresh() {
  const globalSignal = useRef<Signal<number>>(null as any);
  if (!globalSignal.current) {
    globalSignal.current = createSignal(0);
  }

  return globalSignal.current;
}
