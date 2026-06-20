import { useRef } from "react";
import { useIsoEffect } from "../../../hooks/use-iso-effect.js";
import { useGridIdContext } from "../../../root/contexts/grid-id.js";
import { useAnimatingRowsContext } from "../../../root/contexts/row-layout/animating-rows-context.js";
import { useRowChanges } from "./row-changes-context.js";

// Hardcoded for now - duration/easing become user-configurable once we get to the config object.
const DURATION_MS = 200;
const EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

const getRow = (id: string, gridId: string) => {
  const query = `[data-ln-gridid="${gridId}"][data-ln-row="true"][data-ln-row-id="${id}"]`;

  const row = document.querySelector(query) as HTMLElement | null;

  return row;
};

export function RowAnimationDriver() {
  const gridId = useGridIdContext();
  const { moved } = useRowChanges();
  const { startAnimating, stopAnimating } = useAnimatingRowsContext();

  // One Animation object per id for its entire "in motion" lifetime - a row's animation is never
  // cancelled mid-flight. A later move for the same id redirects this same animation (new
  // keyframes, timeline restarted for the new segment) rather than replacing it, so `finished`
  // only ever resolves once, naturally, when the row truly settles.
  const animations = useRef<Map<string, Animation>>(new Map());

  useIsoEffect(() => {
    for (const m of moved) {
      animateMove(m.id, m.from, m.to);
    }

    function animateMove(id: string, fromY: number, toY: number) {
      const el = getRow(id, gridId);
      if (!el) return;

      const existing = animations.current.get(id);

      if (existing) {
        // Redirect the same animation: capture where it actually is right now (not where it was
        // headed), then re-aim it at the new target over a fresh full duration. No cancel, no new
        // Animation object - existing.finished is untouched and will resolve once this redirect
        // (or a later one) finally runs uninterrupted to completion.
        let fromTransform: string | null = null;
        try {
          existing.commitStyles();
          fromTransform = el.style.transform || null;
        } catch {
          // The animation may no longer be associated with this element; fall back below.
        }

        if (fromTransform == null) {
          const delta = fromY - toY;
          fromTransform = delta === 0 ? "none" : `translateY(${delta}px)`;
        }

        const effect = existing.effect as KeyframeEffect | null;
        effect?.setKeyframes([{ transform: fromTransform }, { transform: "none" }]);
        existing.currentTime = 0;
        existing.play();
        return;
      }

      const delta = fromY - toY;
      if (delta === 0) return;

      const fromTransform = `translateY(${delta}px)`;

      startAnimating(id);

      const anim = el.animate([{ transform: fromTransform }, { transform: "none" }], {
        duration: DURATION_MS,
        easing: EASING,
      });

      animations.current.set(id, anim);
      anim.finished
        .catch(() => {})
        .finally(() => {
          if (animations.current.get(id) === anim) {
            animations.current.delete(id);
            // setKeyframes() above (used to redirect mid-flight) replaces the effect's keyframes,
            // but the element's inline style itself is only ever written by commitStyles(). Once
            // the animation's effect is no longer in effect (fill: "none", the default), the
            // computed style falls back to whatever's still sitting in the inline style - clear it
            // so a row that was ever redirected mid-flight doesn't settle permanently offset.
            el.style.transform = "";
            stopAnimating(id);
          }
        });
    }
  }, [moved, gridId, startAnimating, stopAnimating]);

  return <></>;
}
