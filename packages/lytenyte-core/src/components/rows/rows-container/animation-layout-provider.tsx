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
import {
  enterKeyframesFor,
  exitKeyframesFor,
} from "../../../root/contexts/animations/resolve-enter-exit-keyframes.js";

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

export function AnimationLayoutProvider(props: PropsWithChildren) {
  const { moved, added, removed } = useRowChangesContext();
  const rowLayout = useRowLayoutContext();
  const rs = useRowSourceContext();
  const { move, enter, exit } = useRowAnimateSettings();

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

  // Exit must be captured DURING render, not in an effect: by the time any effect for this
  // commit runs, React has already detached the removed row's DOM node from the document (the
  // mutation phase always precedes the layout phase for the same commit). Render, by contrast,
  // happens before that mutation - the DOM here still reflects the previous commit, which is
  // exactly the one last chance to see the row before it's gone. We clone it, freeze it in place
  // with its measured screen position, and animate the clone independently of React entirely.
  useMemo(() => {
    if (!exit || !removed.length) return;

    // A row's full width spans every column, most of which are typically scrolled out of the
    // grid's own viewport - the live row only ever shows the slice the viewport clips to. Our
    // clone is appended to <body> with no such ancestor, so without an explicit clip it would
    // spill its full, unclipped width onto the page. Clip it to the same viewport rect instead.
    const viewportEl = document.querySelector<HTMLElement>(`[data-ln-gridid="${gridId}"][data-ln-viewport]`);
    const viewportRect = viewportEl?.getBoundingClientRect();

    const viewportWidth = viewportEl?.clientWidth ?? viewportRect?.width;
    const viewportHeight = viewportEl?.clientHeight ?? viewportRect?.height;

    for (const r of removed) {
      const el = document.querySelector<HTMLElement>(
        `[data-ln-gridid="${gridId}"][data-ln-row="true"][data-ln-row-id="${r.id}"]`,
      );
      if (!el) continue;

      // If this row was mid-move when it got removed, bake its current interpolated position
      // into the inline style first - cloneNode() only copies the style attribute, not the live
      // WAAPI animation driving it, so without this the clone would snap to its resting position
      // instead of fading out from wherever it actually, visually was.
      animations.current.get(r.id)?.commitStyles();
      animations.current.delete(r.id);
      animating.current.delete(r.id);

      const rect = el.getBoundingClientRect();
      // Non-pinned rows are positioned via a "zero-height parent, overflowing children" trick
      // (see use-row-style.ts) - their own bounding rect always reports height 0. The grid already
      // tracks the row's real visual height in --ln-row-height; fall back to the measured rect
      // only if that's somehow unset (e.g. a pinned row, which has its own real height).
      const rowHeightVar = Number.parseFloat(getComputedStyle(el).getPropertyValue("--ln-row-height"));
      const height = Number.isFinite(rowHeightVar) && rowHeightVar > 0 ? rowHeightVar : rect.height;

      const wrapper = document.createElement("div");
      wrapper.style.position = "fixed";
      wrapper.style.overflow = "hidden";
      wrapper.style.pointerEvents = "none";
      wrapper.style.top = `${viewportRect?.top ?? rect.top}px`;
      wrapper.style.left = `${viewportRect?.left ?? rect.left}px`;
      wrapper.style.width = `${viewportWidth ?? rect.width}px`;
      wrapper.style.height = `${viewportHeight ?? height}px`;

      const ghost = el.cloneNode(true) as HTMLElement;
      ghost.removeAttribute("data-ln-row-id");
      ghost.style.position = "absolute";
      ghost.style.margin = "0";
      ghost.style.top = `${rect.top - (viewportRect?.top ?? rect.top)}px`;
      ghost.style.left = `${rect.left - (viewportRect?.left ?? rect.left)}px`;
      ghost.style.width = `${rect.width}px`;
      ghost.style.height = `${height}px`;
      ghost.style.transform = "none";
      wrapper.appendChild(ghost);
      document.body.appendChild(wrapper);

      const anim = ghost.animate(exitKeyframesFor(exit.type, ghost), {
        duration: exit.duration,
        easing: exit.easing,
      });
      anim.finished.catch(() => {}).finally(() => wrapper.remove());
    }
  }, [removed, exit, gridId]);

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

        // A newly added row has no prior animation to redirect from, always a fresh, one-shot
        // animation.
        el.animate(enterKeyframesFor(enter.type, el), {
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
