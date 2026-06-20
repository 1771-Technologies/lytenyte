import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
  type RefObject,
} from "react";
import { useRowChangesContext } from "../../../root/contexts/animations/row-changes-context.js";
import {
  useRowLayoutContext,
  useRowViewContext,
} from "../../../root/contexts/row-layout/row-layout-context.js";
import type { LayoutRow } from "@1771technologies/lytenyte-shared";
import { useIsoEffect } from "../../../hooks/use-iso-effect.js";
import { useGridIdContext } from "../../../root/contexts/grid-id.js";
import { useRowSourceContext } from "../../../root/contexts/row-source-provider.js";
import { useRowAnimateSettings } from "../../../root/contexts/animations/row-animate-settings-context.js";
import type { Grid } from "../../../index.js";

const context = createContext<{ additionalLayouts: LayoutRow[]; animating: RefObject<Set<string>> }>({
  additionalLayouts: [],
  animating: { current: new Set<string>() },
});

// Our keyframes only ever use translateY(...) or "none", so the committed value is always
// expressible in this form, browsers preserve matching functional notation when interpolating
// between compatible single-function transform lists.
function parseTranslateYPx(value: string): number | null {
  if (value === "none" || value === "") return 0;
  const match = /translateY\(([-\d.]+)px\)/.exec(value);
  return match ? Number.parseFloat(match[1]) : null;
}

// Only "fade" exists today; more enter/exit styles plug in here later without touching the
// effect that drives them.
function enterKeyframesFor(type: Grid.RowAnimateEnterExitType): Keyframe[] {
  switch (type) {
    case "fade":
    default:
      return [{ opacity: 0 }, { opacity: 1 }];
  }
}

export function AnimationLayoutProvider(props: PropsWithChildren) {
  const { moved, added } = useRowChangesContext();
  const rowLayout = useRowLayoutContext();
  const rs = useRowSourceContext();
  const { move, enter } = useRowAnimateSettings();

  const view = useRowViewContext();

  const animating = useRef<Set<string>>(new Set());
  const animations = useRef<Map<string, Animation>>(new Map());

  const prevMove = useRef(moved);

  const [force, setForce] = useState(0);

  const additionalLayouts = useMemo(() => {
    void force;

    const isNewMoveBatch = prevMove.current !== moved;
    prevMove.current = moved;

    // Disabling row move animation must mean we never animate anything - skip before ever
    // touching the animating set, so a disabled grid never keeps a row mounted past its normal
    // virtualized window.
    if (!move) return [];

    if (isNewMoveBatch) {
      // Add the newly moved rows to our animation set.
      moved.forEach((x) => animating.current.add(x.id));
    }

    const idSet = new Set([
      ...view.center.map((x) => x.id),
      ...view.top.map((x) => x.id),
      ...view.bottom.map((x) => x.id),
    ]);

    return [...animating.current.difference(idSet)]
      .map((x) => {
        const index = rs.rowIdToRowIndex(x);
        if (index == null) return null;

        return rowLayout.layoutByIndex(index);
      })
      .filter(Boolean) as LayoutRow[];
  }, [force, move, moved, rowLayout, rs, view.bottom, view.center, view.top]);

  const value = useMemo(() => {
    return { animating, additionalLayouts };
  }, [additionalLayouts]);

  const gridId = useGridIdContext();

  useIsoEffect(() => {
    const needsMove = Boolean(move) && moved.length > 0;
    const needsEnter = Boolean(enter) && added.length > 0;
    if (!needsMove && !needsEnter) return;

    const elementById = new Map<string, HTMLElement>();
    document.querySelectorAll(`[data-ln-gridid="${gridId}"][data-ln-row="true"]`).forEach((row) => {
      const id = row.getAttribute("data-ln-row-id");
      if (id) elementById.set(id, row as HTMLElement);
    });

    if (needsEnter && enter) {
      for (const a of added) {
        const el = elementById.get(a.id);
        if (!el) continue;

        // A newly added row has no prior animation to redirect from - always a fresh, one-shot
        // animation.
        el.animate(enterKeyframesFor(enter.type), {
          duration: enter.duration,
          easing: enter.easing,
        });
      }
    }

    if (!needsMove || !move) return;

    for (const m of moved) {
      const el = elementById.get(m.id);
      if (!el) continue;

      const existing = animations.current.get(m.id);

      if (existing) {
        // Redirect the same animation: capture where it actually is right now (not where it was
        // headed), then re-aim it at the new target over a fresh full duration. No cancel, no new
        // Animation object - existing.finished is untouched and will resolve once this redirect
        // (or a later one) finally runs uninterrupted to completion.
        let fromTransform: string | null = null;
        try {
          existing.commitStyles();
          const committed = parseTranslateYPx(el.style.transform);
          if (committed != null) {
            // The committed value is an offset relative to the row's PREVIOUS top (m.from) - React
            // has already re-rendered the row's CSS top to its new target (m.to) by the time this
            // effect runs, so that same offset now means something different. Rebase it by exactly
            // how much the base itself just shifted, or the row jumps to wherever the unadjusted
            // offset happens to land relative to the new base, rather than continuing from where
            // it actually, visually was.
            const rebased = committed + (m.from - m.to);
            fromTransform = rebased === 0 ? "none" : `translateY(${rebased}px)`;
          }
        } catch {
          // The animation may no longer be associated with this element; fall back below.
        }

        if (fromTransform == null) {
          const delta = m.from - m.to;
          fromTransform = delta === 0 ? "none" : `translateY(${delta}px)`;
        }

        const effect = existing.effect as KeyframeEffect | null;
        effect?.setKeyframes([{ transform: fromTransform }, { transform: "none" }]);
        existing.currentTime = 0;
        existing.play();
        continue;
      }

      const delta = m.from - m.to;
      if (delta === 0) continue;

      const anim = el.animate([{ transform: `translateY(${delta}px)` }, { transform: "none" }], {
        duration: move.duration,
        easing: move.easing,
      });

      animations.current.set(m.id, anim);
      anim.finished
        .catch(() => {})
        .finally(() => {
          if (animations.current.get(m.id) === anim) {
            animations.current.delete(m.id);
            // setKeyframes() above (used to redirect mid-flight) replaces the effect's keyframes,
            // but the element's inline style itself is only ever written by commitStyles(). Once
            // the animation's effect is no longer in effect (fill: "none", the default), the
            // computed style falls back to whatever's still sitting in the inline style - clear
            // it so a row that was ever redirected mid-flight doesn't settle permanently offset.
            el.style.transform = "";
            animating.current.delete(m.id);
            setForce((prev) => prev + 1);
          }
        });
    }
  }, [moved, added, gridId, move, enter]);

  return <context.Provider value={value}>{props.children}</context.Provider>;
}

export const useAnimationLayouts = () => useContext(context);
