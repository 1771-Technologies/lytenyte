import { useCallback, useRef, useState } from "react";

type TransitionState = "open-begin" | "opening" | "open" | "close-begin" | "closing" | "closed";

export interface TransitionOptions {
  timeEnter?: number;
  timeExit?: number;
  initial?: boolean;
}

export function useTransitionedOpen({
  timeEnter = 300,
  timeExit = 300,
  initial = false,
}: TransitionOptions = {}) {
  const [shouldMount, setShouldMount] = useState(initial);
  const [open, setOpen] = useState(initial);
  const [state, setState] = useState<TransitionState>(initial ? "open" : "closed");

  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggle = useCallback(
    (toOpen?: boolean) => {
      const isOpenOrOpening = state === "open" || state === "opening" || state === "open-begin";
      const isClosedOrClosing = state === "closed" || state === "closing" || state === "close-begin";

      const shouldOpen = toOpen === true || isClosedOrClosing;

      // We were closed or closing, but now we are opening.
      if (shouldOpen && !isOpenOrOpening) {
        /* v8 ignore next 1 */
        if (timeoutId.current) clearTimeout(timeoutId.current);

        setState("open-begin");
        setShouldMount(true);
        setOpen(true);

        timeoutId.current = setTimeout(() => {
          setState("opening");

          timeoutId.current = setTimeout(() => {
            setState("open");
          }, timeEnter);
        });
      }

      // We were open or opening but now we want to close
      if (!shouldOpen && isOpenOrOpening) {
        if (timeoutId.current) clearTimeout(timeoutId.current);

        setState("close-begin");
        setOpen(false);

        timeoutId.current = setTimeout(() => {
          setState("closing");
          timeoutId.current = setTimeout(() => {
            setState("closed");
            setShouldMount(false);
          }, timeExit);
        });
      }
    },
    [state, timeEnter, timeExit],
  );

  return { shouldMount, open, state, toggle };
}
