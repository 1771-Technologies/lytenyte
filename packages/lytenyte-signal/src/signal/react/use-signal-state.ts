/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { useRef } from "react";
import type { ReadSignal } from "../+types.js";
import { signal } from "../vanilla/signal.js";

export function useSignalState<T>(c: T): ReadSignal<T>;
export function useSignalState<T, K extends Function>(c: T, k: K): ReadSignal<T> & { set: K };
export function useSignalState<T, K extends Function>(
  c: T,
  setter?: K | undefined,
): K extends undefined ? { (): T } : { (): T; set: K } {
  const signalRef = useRef<any>(null as any);
  if (!signalRef.current) {
    signalRef.current = signal(c) as any;
    signalRef.current.setValue = signalRef.current.set;
    signalRef.current.set = setter;
  }

  const $ = signalRef.current;
  if ($() != c) $.setValue(c);

  return $;
}
