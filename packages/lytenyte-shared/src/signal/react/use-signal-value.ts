import { useEffect, useReducer, useRef } from "react";
import type { ReadSignal } from "../+types.js";
import { effect } from "../vanilla/signal.js";

export function useSignalValue<T>(v: ReadSignal<T>) {
  // Ref to track our signal. The signal itself may be changed, so we need to track
  // which signal we are using - this doesn't violate any React rules an is actually quite
  // powerful - particularly when used along side signal stores.
  const currentRef = useRef(null as any);

  // We want to force a re-render using React's primitives. Avoid using useSyncExternalStore
  // since this results in a de-opt of React concurrent mode.
  const [, rerender] = useReducer((p) => p + 1, 0);

  // Keep track of the last value as way to determine if the signal update is part of a broader
  // React re-render. For example, if the set function is called in an event that also calls a
  // setState. React will re-render then the effects will be run. If our effect here causes a
  // re-render we effectively double the render cost.
  // The body of this function will run. This means that signal will already be up to
  // date. However the effect for the signal will likely be run after. We can compare the current
  // signal value with the captured value. If they differ it means that the render was not caused
  // by the effect of updating the signal. Hence the effect can safely be skipped since it will not
  // do anything but cause an additional re-render.
  const value = useRef(null);
  const skipEffect = useRef(true); // Default to tree since the first effect should not run.

  // The signal was changed, so we need to reset things
  if (currentRef.current !== v) {
    currentRef.current = v;
    value.current = currentRef.current();
    skipEffect.current = true;
  }

  // If the values aren't equal it means some other process triggered a re-render but the signal
  // has already been updated. Since the signal has been updated its effect below will run to
  // cause a re-render. If we let the effect cause a re-render we will have a double re-render.
  // To avoid this we make the skipEffect as true. This will mean the effect will get skipped
  // when it runs since the current view of the state is the same.
  if (value.current !== currentRef.current()) {
    // The value has changed, but we are already rerunning this hook,
    // so mark the effect to skip.
    skipEffect.current = true;
  }

  useEffect(() => {
    return effect(() => {
      const v = currentRef.current();

      if (skipEffect.current) {
        skipEffect.current = false;
      } else {
        value.current = v;
        rerender();
      }
    });
  }, [v]);

  // Always return the most up to date value.
  return currentRef.current();
}
