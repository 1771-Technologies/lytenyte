import { useMutableState } from "./use-mutable-state.js";

interface MutableState {
  /**
   * ### INTERNAL API ###
   * Whether to capture focus
   */
  a?: boolean | 0 | 1;
}

const useFocusCapture = (focusRef: React.RefObject<HTMLElement | null>) => {
  const mutable = useMutableState<MutableState>({});

  return [
    () => {
      mutable.a = 1;
    },
    () => {
      if (mutable.a) {
        mutable.a = 0;
        focusRef.current?.focus();
        return true;
      }
    },
    () => {
      mutable.a = 0;
      focusRef.current?.focus();
    },
  ] as const;
};

export { useFocusCapture };
