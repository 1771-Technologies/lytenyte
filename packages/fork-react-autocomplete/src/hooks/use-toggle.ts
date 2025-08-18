import { useMutableState } from "./use-mutable-state.js";

interface MutableState {
  /**
   * ### INTERNAL API ###
   * Whether to capture focus
   */
  a?: boolean | 0 | 1;
}

const useToggle = (open: boolean, setOpen: (value: boolean) => void) => {
  const mutable = useMutableState<MutableState>({});

  return [
    () => (mutable.a = open),
    () => {
      if (mutable.a) {
        mutable.a = 0;
      } else {
        setOpen(true);
      }
    },
  ] as const;
};

export { useToggle };
