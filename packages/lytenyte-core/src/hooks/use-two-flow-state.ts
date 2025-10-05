import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useEvent } from "./use-event.js";

/**
 * This hook should be used seldomly. It will effectively create a piece of state that may be
 * changed but will reset when the value it used is updated. It's effectively a resettable value.
 */
export function useTwoFlowState<T>(value: T) {
  const [state, setValue] = useState(() => ({ current: value }));

  const setState: Dispatch<SetStateAction<T>> = useEvent((p) => {
    if (typeof p === "function") setValue({ current: (p as any)(state.current) });
    else setValue({ current: p });
  });

  const prevState = useRef(value);
  const current = useMemo(() => {
    if (prevState.current != value) return value;

    return state.current;
  }, [state, value]);

  useEffect(() => {
    if (prevState.current === value) return;

    prevState.current = value;
    state.current = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return [current, setState] as const;
}
