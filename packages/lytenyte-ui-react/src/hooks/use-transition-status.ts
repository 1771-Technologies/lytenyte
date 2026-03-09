import { useCallback, useEffect, useMemo, useState } from "react";

export type TransitionStatus = "opening" | "closing" | "idle";

export function useTransitionedOpen(open: boolean, element: HTMLElement | null | (HTMLElement | null)[]) {
  const [mounted, setMount] = useState(open);
  const [status, setStatus] = useState<TransitionStatus>("idle");

  const elements = useMemo(() => {
    if (Array.isArray(element)) return element;
    return [element];
  }, [element]);

  const getAnimationPromise = useCallback(() => {
    if (elements.some((x) => !x)) return;

    const animations = elements.map((x) => x!.getAnimations()).flat();

    if (animations.length === 0) return null;

    return Promise.all(animations.map((x) => x.finished));
  }, [elements]);

  // Both effects below intentionally call setState synchronously to drive the animation state machine.
  useEffect(() => {
    if (open && !mounted) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMount(true);
      setStatus("opening");
    }
  }, [mounted, open]);

  useEffect(() => {
    if (elements.some((x) => !x)) return;

    const handleIdle = (fn?: () => void) => {
      const f = setTimeout(() => {
        const animationPromise = getAnimationPromise();
        if (!animationPromise) {
          setStatus("idle");
          fn?.();
          return;
        }

        animationPromise.finally(() => {
          setStatus("idle");
          fn?.();
        });
      });

      return () => clearTimeout(f);
    };

    if (open && mounted) {
      // We are mounted and open. Then we just need to check if the status is opening or closing.
      // If the status is opening then we should just wait for it to become idle.
      // If the status is closing, we should update it to opening then wait for it to become idle.
      // If the status is idle, then there is nothing to be done.
      if (status === "opening") return handleIdle();
      if (status === "closing") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStatus("opening");
        return handleIdle();
      }
    } else if (!open && mounted) {
      // We are closed but the element is mounted. Set the status to closing and wait
      // for the animations to finish before setting back to idle. Once the animation finished
      // then set mounted to false.
      setStatus("closing");
      return handleIdle(() => setMount(false));
    } else if (open && !mounted) {
      // We are open, but we haven't mounted our component. We need to set mount to open
      // and status to "opening". Then check for animations.
      setStatus("opening");
      setMount(true);

      return handleIdle();
    } else if (!open && !mounted) {
      setStatus("idle");
    }
  }, [elements, getAnimationPromise, mounted, open, status]);

  return { mounted, status };
}
