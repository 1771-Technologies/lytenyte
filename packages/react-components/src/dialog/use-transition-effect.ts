import { useEffect, useRef, useState } from "react";

export type OpenState = "open-begin" | "opening" | "open" | "close-begin" | "closing" | "closed";

export function useTransitionEffect(
  open: boolean,
  timeEnter: number = 300,
  timeExit: number = 300,
) {
  const [state, setState] = useState<OpenState>(open ? "open" : "closed");
  const [shouldMount, setShouldMount] = useState(open);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const isOpenOrOpening = state === "open" || state === "opening" || state === "open-begin";
    const isClosedOrClosing = state === "closed" || state === "closing" || state === "close-begin";

    if (open && !isOpenOrOpening) {
      if (timeoutId.current) clearTimeout(timeoutId.current);

      setState("open-begin");
      setShouldMount(true);

      timeoutId.current = setTimeout(() => {
        setState("opening");

        timeoutId.current = setTimeout(() => {
          setState("open");
        }, timeEnter);
      });
    }

    if (!open && !isClosedOrClosing) {
      if (timeoutId.current) clearTimeout(timeoutId.current);

      setState("close-begin");

      timeoutId.current = setTimeout(() => {
        setState("closing");
        timeoutId.current = setTimeout(() => {
          setState("closed");
          setShouldMount(false);
        }, timeExit);
      });
    }
  }, [open, state, timeEnter, timeExit]);

  return { state, shouldMount };
}
