import { useCallback, useEffect, useRef, useState } from "react";
import { useEvent } from "./use-event.js";
import { DATA_STATUS } from "../constants.js";

export type TransitionStatus = "idle" | "start" | "opening" | "closing" | "closed";

export type OnStatusChange = (next: TransitionStatus, prev: TransitionStatus, element: HTMLElement) => void;

export function useTransitionedOpen(open: boolean, onStatusChange?: OnStatusChange) {
  const [mounted, setMount] = useState(open);
  const statusRef = useRef<TransitionStatus>("idle");
  const elementRef = useRef<HTMLElement | null>(null);
  const onStatusChangeRef = useRef(onStatusChange);

  onStatusChangeRef.current = onStatusChange;

  const transition = useEvent((next: TransitionStatus) => {
    const prev = statusRef.current;
    if (prev === next) return;

    const el = elementRef.current;
    if (el) {
      el.setAttribute(DATA_STATUS, next);
      onStatusChangeRef.current?.(next, prev, el);
    }

    statusRef.current = next;
  });

  const ref = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
    if (node) {
      const status = statusRef.current;
      if (status !== "idle") {
        onStatusChangeRef.current?.(status, "idle", node);
      }
      node.setAttribute(DATA_STATUS, status);
    }
  }, []);

  useEffect(() => {
    if (open && !mounted) {
      transition("start");
      setMount(true);
      return;
    }

    const el = elementRef.current;
    if (!el) return;

    let rafId: number;
    let cancelled = false;

    // Waits one animation frame so the browser can run style recalculation,
    // then checks for active CSS transitions/animations on the element.
    // If any exist, waits for them to finish before calling onComplete.
    const waitForAnimations = (onComplete: () => void) => {
      rafId = requestAnimationFrame(() => {
        if (cancelled) return;
        const animations = el.getAnimations();

        if (animations.length === 0) {
          onComplete();
          return;
        }

        Promise.allSettled(animations.map((a) => a.finished)).then(() => {
          if (!cancelled) onComplete();
        });
      });
    };

    if (open) {
      // Interrupted close — skip "start", go directly to "opening"
      // so the CSS transition reverses smoothly from the current height.
      if (statusRef.current === "closing" || statusRef.current === "closed") {
        el.style.height = "";
        transition("opening");
      }

      // Fresh mount — the browser has painted "start" (height: 0) by the
      // time this effect runs (useEffect fires after paint), so transitioning
      // to "opening" creates a CSS transition from 0 → var(--panel-height).
      if (statusRef.current === "start") {
        transition("opening");
      }

      if (statusRef.current === "opening") {
        // Double rAF: the first crosses the current frame boundary so the
        // browser runs style recalculation and creates any pending CSS
        // transitions. The second (inside waitForAnimations) queries them.
        rafId = requestAnimationFrame(() => {
          if (cancelled) return;
          waitForAnimations(() => transition("idle"));
        });
      }
    } else if (!open && mounted) {
      if (statusRef.current !== "closing") {
        // Capture the current rendered height BEFORE transition("closing")
        // sets data-status="closing", which applies CSS height: 0.
        const currentHeight = el.getBoundingClientRect().height;
        el.style.height = `${currentHeight}px`;
        transition("closing");
      }

      // Frame 1: remove the inline height override so the CSS transition
      // from the concrete height to 0 begins.
      // Frame 2 (inside waitForAnimations): the browser has run style
      // recalculation between frames, so getAnimations() picks up the
      // running transition and we wait for it to finish before unmounting.
      rafId = requestAnimationFrame(() => {
        if (cancelled) return;
        el.style.height = "";
        waitForAnimations(() => {
          transition("closed");
          setMount(false);
        });
      });
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [mounted, open, transition]);

  return { mounted, ref };
}
