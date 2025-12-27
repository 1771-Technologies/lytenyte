import { equal } from "@1771technologies/lytenyte-shared";
import { useCallback, useRef, useState, type SetStateAction } from "react";

export interface UseControlledProps<T = unknown> {
  /**
   * Holds the component value when it's controlled.
   */
  controlled: T | undefined;
  /**
   * The default value when uncontrolled.
   */
  default: T | undefined;
}

export function useControlled<T = unknown>({
  controlled,
  default: defaultProp,
}: UseControlledProps<T>): [T, (newValue: T | ((prevValue: T) => T)) => void] {
  // isControlled is ignored in the hook dependency lists as it should never change.
  const { current: isControlled } = useRef(controlled !== undefined);
  const [valueState, setValue] = useState(defaultProp);
  const value = isControlled ? controlled : valueState;

  // This if condition is a bit weird but essentially we are trying to make up for the
  // fact that React doesn't hot reload when an uncontrolled value's initial value is changed.
  // This is mainly done for DX in Vite environments, and bundlers will remove this code.
  // @ts-expect-error this is fine
  if (import.meta.hot) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const prev = useRef(defaultProp);
    if (!equal(prev.current, defaultProp)) {
      queueMicrotask(() => setValue(defaultProp as T));
      prev.current = defaultProp;
    }
  }

  const setValueIfUncontrolled = useCallback((newValue: SetStateAction<T>) => {
    if (!isControlled) {
      setValue(newValue as T);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [value as T, setValueIfUncontrolled];
}
