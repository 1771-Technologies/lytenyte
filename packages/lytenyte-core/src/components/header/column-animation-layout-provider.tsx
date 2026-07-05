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

function parseTranslateXPx(value: string): number {
  if (value === "none" || value === "") return 0;
  const match = /translateX\(([-\d.]+)px\)/.exec(value);
  return match ? Number.parseFloat(match[1]) : 0;
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

function queryHeaderByColumnId(gridId: string, columnId: string): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      `[data-ln-gridid="${gridId}"][data-ln-colid="${columnId}"][data-ln-header-cell]`,
    ),
  );
}

function queryDataByColumnId(gridId: string, columnId: string): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      `[data-ln-gridid="${gridId}"][data-ln-colid="${columnId}"][data-ln-cell]`,
    ),
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

      // Non-pinned cells (both header and data) carry `transform: var(--ln-x-transform)` in
      // sync-scroll mode. Compose our FLIP delta onto that reference so the cell keeps tracking
      // live scroll during the animation. Pinned cells (sticky, no --ln-x-transform) and all
      // cells in non-sync mode animate with a plain translateX instead.
      const syncCompose = sync && !isPinnedHeaderCell(el);
      const existing = animations.current.get(el);

      if (existing) {
        try {
          existing.commitStyles();
        } catch {
          // Animation may no longer be associated with this element; the classified from/to
          // values below are used as a safe fallback either way.
        }
      }

      // commitStyles() bakes the CSS variable into its currently-resolved literal value (e.g.
      // "translate3d(-50px,0,0) translateX(60px)"), but our own appended translateX(...) term
      // is still trailing and regex-matchable regardless of what (if anything) precedes it -
      // we only ever care about extracting that trailing delta, never the resolved var() prefix
      // itself, so this baked snapshot is harmless and never gets reused verbatim below.
      const committed = existing ? parseTranslateXPx(el.style.transform) : m.fromX - m.toX;
      const rebased = existing ? committed + (m.fromX - m.toX) : committed;
      const prefix = syncCompose ? "var(--ln-x-transform) " : "";
      const keyframeFrom: Keyframe = { transform: `${prefix}translateX(${rebased}px)` };
      const keyframeTo: Keyframe = { transform: syncCompose ? "var(--ln-x-transform)" : "none" };

      // Write the resting (post-animation) inline style value SYNCHRONOUSLY, right now - not in a
      // `.finished` callback. An active WAAPI animation overlays the computed style for whatever
      // it's animating, completely independent of the underlying inline style (`commitStyles()`
      // is the only thing that writes to inline style mid-flight) - so setting the final target
      // now is invisible while the animation plays, and is already correct the instant it
      // finishes, naturally or via a future redirect.
      //
      // For sync-composed cells, the resting value must be the LIVE "var(--ln-x-transform)"
      // reference so the cell keeps tracking scroll after the move settles - this matches exactly
      // what React itself sets via its own style prop for these cells. For all other cells,
      // "none" is correct: React never sets `transform` on pinned or non-sync cells, so "none"
      // is safe as a permanent inline style and will be ignored by React's reconciler.
      el.style.transform = syncCompose ? "var(--ln-x-transform)" : "none";

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

    // Use the header container as the positioning parent rather than document.body with a fixed
    // wrapper. The header element is `position: sticky`, which establishes a containing block for
    // absolutely-positioned children. Clones placed here move with the grid naturally and are
    // clipped by the same ancestor overflow that clips live header cells — no need to measure a
    // separate viewport rect or deal with fixed-positioning breaking inside CSS transforms.
    const headerEl = document.querySelector<HTMLElement>(`[data-ln-gridid="${gridId}"][data-ln-header]`);
    if (!headerEl) return;
    const headerRect = headerEl.getBoundingClientRect();

    const exitSettings = exit;

    function cloneIntoHeader(container: HTMLElement, el: HTMLElement) {
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
      clone.style.pointerEvents = "none";
      // cloneNode() copies the original's ENTIRE inline style, which may include positioning
      // properties from how it was actually laid out (insetInlineStart/insetInlineEnd for sticky
      // pinned cells, gridColumnStart/gridRow for header cells). Those are equivalent-edge
      // properties to top/left and can win the cascade over a same-edge property set afterward,
      // so they must be cleared explicitly - otherwise the clone renders at its ORIGINAL
      // position instead of inside the header container.
      clone.style.insetInlineStart = "";
      clone.style.insetInlineEnd = "";
      clone.style.right = "";
      clone.style.bottom = "";
      clone.style.gridColumnStart = "";
      clone.style.gridColumnEnd = "";
      clone.style.gridRow = "";
      clone.style.top = `${rect.top - headerRect.top}px`;
      clone.style.left = `${rect.left - headerRect.left}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.transform = "none";
      // Append to the cell's original parent (the header row) rather than the header container
      // directly - this keeps the clone inside the same ancestor chain so CSS selectors that
      // depend on it (e.g. [data-ln-header-row] > [data-ln-header-cell]) continue to match.
      // The header row is position:static so the absolute clone escapes to the position:sticky
      // header container as its containing block, which is exactly where headerRect was measured.
      (el.parentElement ?? container).appendChild(clone);

      const anim = clone.animate(exitKeyframesFor(exitSettings.type, clone), {
        duration: exitSettings.duration,
        easing: exitSettings.easing,
      });
      anim.finished.catch(() => {}).finally(() => clone.remove());
    }

    function cloneDataCell(el: HTMLElement) {
      const parent = el.parentElement;
      if (!parent) return;

      const existing = animations.current.get(el);
      try {
        existing?.commitStyles();
      } catch {
        // Animation may no longer be associated with this element.
      }
      animations.current.delete(el);

      const clone = el.cloneNode(true) as HTMLElement;
      // Strip the column id so move/enter animations don't pick up the exit ghost.
      clone.removeAttribute("data-ln-colid");
      clone.removeAttribute("data-ln-gridid");
      clone.style.pointerEvents = "none";
      // Data cells are position:absolute within their row, so the clone inherits the
      // correct insetInlineStart and dimensions without any recomputation. In sync mode
      // the inline transform var() is also copied, so the ghost stays scroll-tracked.
      parent.appendChild(clone);

      const anim = clone.animate(exitKeyframesFor(exitSettings.type, clone), {
        duration: exitSettings.duration,
        easing: exitSettings.easing,
      });
      anim.finished.catch(() => {}).finally(() => clone.remove());
    }

    for (const r of leaf.removed) {
      for (const el of queryHeaderByColumnId(gridId, r.id)) cloneIntoHeader(headerEl, el);
      for (const el of queryDataByColumnId(gridId, r.id)) cloneDataCell(el);
    }

    for (const r of group.removed) {
      for (const el of queryByGroupOccurrence(gridId, r.id)) cloneIntoHeader(headerEl, el);
    }
  }, [leaf.removed, group.removed, exit, gridId]);

  return <>{children}</>;
}
