import { useMemo, useRef, type PropsWithChildren } from "react";
import { useIsoEffect } from "../../hooks/use-iso-effect.js";
import { useGridIdContext } from "../../root/contexts/grid-id.js";
import { useSuppressScrollFlashContext } from "../../root/contexts/viewport/viewport-context.js";
import { useColumnChangesContext } from "../../root/contexts/animations/column-changes-context.js";
import { useColumnAnimateSettings } from "../../root/contexts/animations/column-animate-settings-context.js";
import {
  enterKeyframesFor,
  exitKeyframesFor,
} from "../../root/contexts/animations/resolve-enter-exit-keyframes.js";
import type { ColumnMoved } from "../../root/contexts/animations/column-types.js";

function parsePx(value: string): number {
  if (value === "" || value === "auto") return 0;
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function parseTranslateXPx(value: string): number {
  if (value === "none" || value === "") return 0;
  const match = /translateX\(([-\d.]+)px\)/.exec(value);
  return match ? Number.parseFloat(match[1]) : 0;
}

function isHeaderKind(el: HTMLElement): boolean {
  return el.hasAttribute("data-ln-header-cell") || el.hasAttribute("data-ln-header-group");
}

function isPinnedHeaderCell(el: HTMLElement): boolean {
  const pin = el.getAttribute("data-ln-colpin");
  return pin === "start" || pin === "end";
}

function queryByColumnId(gridId: string, columnId: string): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(`[data-ln-gridid="${gridId}"][data-ln-colid="${columnId}"]`),
  );
}

function queryByGroupOccurrence(gridId: string, idOccurrence: string): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      `[data-ln-gridid="${gridId}"][data-ln-header-occurrence="${idOccurrence}"]`,
    ),
  );
}

export function ColumnAnimationLayoutProvider({ children }: PropsWithChildren) {
  const { leaf, group } = useColumnChangesContext();
  const { move, enter, exit } = useColumnAnimateSettings();
  const gridId = useGridIdContext();
  const sync = useSuppressScrollFlashContext();

  const animations = useRef<WeakMap<HTMLElement, Animation>>(new WeakMap());

  useIsoEffect(() => {
    if (!move && !enter) return;

    function animateMoveOne(el: HTMLElement, m: ColumnMoved) {
      if (!move) return;

      const headerKind = isHeaderKind(el);
      // Center (non-pinned) header cells already use `transform: var(--ln-x-transform)` for
      // sync-scroll, replacing that with our own bare translateX would freeze the cell at
      // whatever scroll offset happened to be live when the move started, breaking scroll-sync
      // for the rest of the animation (and, if we're not careful, after it settles too). Compose
      // our FLIP offset onto the SAME var() reference instead: CSS transform function lists chain
      // left-to-right, so `var(--ln-x-transform) translateX(Npx)` applies both simultaneously, and
      // the cell keeps tracking live scroll the entire time. Pinned header cells never reference
      // that variable at all (sticky + insetInlineStart/insetInlineEnd instead), so they animate
      // unconditionally, exactly like non-sync mode.
      const headerSyncCompose = headerKind && sync && !isPinnedHeaderCell(el);
      const existing = animations.current.get(el);

      if (existing) {
        try {
          existing.commitStyles();
        } catch {
          // Animation may no longer be associated with this element; the classified from/to
          // values below are used as a safe fallback either way.
        }
      }

      const keyframeFrom: Keyframe = {};
      const keyframeTo: Keyframe = {};

      if (headerKind) {
        // commitStyles() bakes the CSS variable into its currently-resolved literal value (e.g.
        // "translate3d(-50px,0,0) translateX(60px)"), but our own appended translateX(...) term
        // is still trailing and regex-matchable regardless of what (if anything) precedes it -
        // we only ever care about extracting that trailing delta, never the resolved var() prefix
        // itself, so this baked snapshot is harmless and never gets reused verbatim below.
        const committed = existing ? parseTranslateXPx(el.style.transform) : m.fromX - m.toX;
        const rebased = existing ? committed + (m.fromX - m.toX) : committed;
        const prefix = headerSyncCompose ? "var(--ln-x-transform) " : "";
        keyframeFrom.transform = `${prefix}translateX(${rebased}px)`;
        keyframeTo.transform = headerSyncCompose ? "var(--ln-x-transform)" : "none";
      } else {
        const from = existing ? parsePx(el.style.insetInlineStart) : m.fromX;
        keyframeFrom.insetInlineStart = `${from}px`;
        keyframeTo.insetInlineStart = `${m.toX}px`;
      }

      // Write the resting (post-animation) inline style value SYNCHRONOUSLY, right now - not in a
      // `.finished` callback. An active WAAPI animation overlays the computed style for whatever
      // it's animating, completely independent of the underlying inline style (`commitStyles()`
      // is the only thing that writes to inline style mid-flight) - so setting the final target
      // now is invisible while the animation plays, and is already correct the instant it
      // finishes, naturally or via a future redirect.
      //
      // This sidesteps a real race with relying on `.finished`: that promise is captured once at
      // creation and may settle (asynchronously, via microtask) for the FIRST play-through even
      // after we've since redirected the same Animation object toward a newer target - a stale
      // `.finished.finally()` from an earlier call can fire (since `animations.current.get(el) ===
      // anim` still passes; redirecting never replaces the map entry) and overwrite the inline
      // style with ITS OWN closure's now-outdated m.toX, clobbering the actually-correct value the
      // newer redirect just set. Writing synchronously avoids ever needing to trust which
      // `.finished` callback fires last.
      //
      // For non-sync-composed header cells, `transform` is a property React never sets itself, so
      // resting it at "none" is always safe. For sync-composed center cells, the resting value
      // must be the LIVE "var(--ln-x-transform)" reference (not "none") so the cell keeps tracking
      // scroll after the move settles - this is also exactly what React itself sets via its own
      // style prop for these cells, so writing it keeps the DOM in agreement with what React's
      // reconciler believes is there. `insetInlineStart` mirrors exactly what React already wrote
      // for THIS render (m.toX comes from the same diff that produced it) for the same reason -
      // React only re-writes a property when its own computed value differs from what it last
      // set; if we instead left a stale commitStyles()-written value in place, a future render
      // that happens to recompute the SAME target would have nothing to overwrite it with, leaving
      // the stale value stuck permanently.
      if (headerKind) el.style.transform = headerSyncCompose ? "var(--ln-x-transform)" : "none";
      else el.style.insetInlineStart = `${m.toX}px`;

      if (existing) {
        // Redirect the same animation in place - never cancel(). Cancelling rejects `finished`
        // and forces a fresh Animation object; setKeyframes() + resetting the timeline lets the
        // same object keep running.
        const effect = existing.effect as KeyframeEffect | null;
        effect?.setKeyframes([keyframeFrom, keyframeTo]);
        existing.currentTime = 0;
        existing.play();
        return;
      }

      const anim = el.animate([keyframeFrom, keyframeTo], {
        duration: move.duration,
        easing: move.easing,
      });

      animations.current.set(el, anim);
      // Only used for WeakMap bookkeeping now (so a later move knows whether to redirect vs start
      // fresh) - not for style cleanup, which already happened above. A stale/early fire here is
      // harmless: the worst case is a redundant fresh `el.animate()` later if this element moves
      // again, not an incorrect visual state.
      anim.finished
        .catch(() => {})
        .finally(() => {
          if (animations.current.get(el) === anim) animations.current.delete(el);
        });
    }

    function animateEnterOne(el: HTMLElement) {
      if (!enter) return;
      el.animate(enterKeyframesFor(enter.type, el), { duration: enter.duration, easing: enter.easing });
    }

    if (move) {
      for (const m of leaf.moved) {
        for (const el of queryByColumnId(gridId, m.id)) animateMoveOne(el, m);
      }
      for (const m of group.moved) {
        for (const el of queryByGroupOccurrence(gridId, m.id)) animateMoveOne(el, m);
      }
    }

    if (enter) {
      for (const a of leaf.added) {
        for (const el of queryByColumnId(gridId, a.id)) animateEnterOne(el);
      }
      for (const a of group.added) {
        for (const el of queryByGroupOccurrence(gridId, a.id)) animateEnterOne(el);
      }
    }
  }, [leaf, group, move, enter, gridId, sync]);

  // Exit must be captured DURING render, not in an effect: by the time any effect for this
  // commit runs, React has already detached the removed column's DOM nodes (mutation always
  // precedes layout/effects for the same commit). Render happens before that mutation - the one
  // last chance to see the column before it's gone. Gated by [leaf.removed, group.removed, ...]
  // so this runs exactly once per actual change, not on every unrelated re-render.
  useMemo(() => {
    if (!exit || (!leaf.removed.length && !group.removed.length)) return;

    const viewportEl = document.querySelector<HTMLElement>(`[data-ln-gridid="${gridId}"][data-ln-viewport]`);
    const viewportRect = viewportEl?.getBoundingClientRect();
    const clipTop = viewportRect?.top ?? 0;
    const clipLeft = viewportRect?.left ?? 0;
    const clipWidth = viewportRect?.width ?? 0;
    const clipHeight = viewportRect?.height ?? 0;

    function makeWrapper(): HTMLElement {
      const wrapper = document.createElement("div");
      wrapper.style.position = "fixed";
      wrapper.style.overflow = "hidden";
      wrapper.style.pointerEvents = "none";
      wrapper.style.top = `${clipTop}px`;
      wrapper.style.left = `${clipLeft}px`;
      wrapper.style.width = `${clipWidth}px`;
      wrapper.style.height = `${clipHeight}px`;
      document.body.appendChild(wrapper);
      return wrapper;
    }

    function cloneInto(wrapper: HTMLElement, el: HTMLElement) {
      const existing = animations.current.get(el);
      try {
        existing?.commitStyles();
      } catch {
        // Animation may no longer be associated with this element.
      }
      animations.current.delete(el);

      // getBoundingClientRect() reflects the current PAINTED position (transform included), so
      // the clone's position is set directly from it and any inherited transform is cleared -
      // applying both would double-count an offset that's already baked into this measurement.
      const rect = el.getBoundingClientRect();
      const clone = el.cloneNode(true) as HTMLElement;
      clone.style.position = "absolute";
      clone.style.margin = "0";
      // cloneNode() copies the original's ENTIRE inline style, which may include positioning
      // properties from how it was actually laid out (insetInlineStart/insetInlineEnd for sticky
      // pinned cells, gridColumnStart/gridRow for header cells). Those are equivalent-edge
      // properties to top/left and can win the cascade over a same-edge property set afterward,
      // so they must be cleared explicitly - otherwise the clone renders at its ORIGINAL
      // viewport-relative position instead of inside this wrapper.
      clone.style.insetInlineStart = "";
      clone.style.insetInlineEnd = "";
      clone.style.right = "";
      clone.style.bottom = "";
      clone.style.gridColumnStart = "";
      clone.style.gridColumnEnd = "";
      clone.style.gridRow = "";
      clone.style.top = `${rect.top - clipTop}px`;
      clone.style.left = `${rect.left - clipLeft}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.transform = "none";
      wrapper.appendChild(clone);
    }

    for (const r of leaf.removed) {
      const elements = queryByColumnId(gridId, r.id);
      if (!elements.length) continue;

      const wrapper = makeWrapper();
      for (const el of elements) cloneInto(wrapper, el);

      const anim = wrapper.animate(exitKeyframesFor(exit.type, wrapper), {
        duration: exit.duration,
        easing: exit.easing,
      });
      anim.finished.catch(() => {}).finally(() => wrapper.remove());
    }

    for (const r of group.removed) {
      const elements = queryByGroupOccurrence(gridId, r.id);
      if (!elements.length) continue;

      const wrapper = makeWrapper();
      for (const el of elements) cloneInto(wrapper, el);

      const anim = wrapper.animate(exitKeyframesFor(exit.type, wrapper), {
        duration: exit.duration,
        easing: exit.easing,
      });
      anim.finished.catch(() => {}).finally(() => wrapper.remove());
    }
  }, [leaf.removed, group.removed, exit, gridId]);

  return <>{children}</>;
}
