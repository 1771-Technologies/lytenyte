import { useMemo, useRef } from "react";
import type { RowPin } from "@1771technologies/lytenyte-shared";
import { useYCoordinates } from "../../root/contexts/coordinates.js";
import { useRowSourceContext } from "../../root/contexts/row-source-provider.js";
import { useRowCountsContext } from "../../root/contexts/grid-areas/row-counts-context.js";
import { useIsoEffect } from "../../hooks/use-iso-effect.js";
import { useRowLayoutContext, useRowViewContext } from "../../root/contexts/row-layout/row-layout-context.js";
import { useGridIdContext } from "../../root/contexts/grid-id.js";
import { useAnimatingRowsContext } from "../../root/contexts/row-layout/animating-rows-context.js";

interface PositionEntry {
  readonly y: number;
  readonly pin: RowPin;
}

// Hardcoded for now - duration/easing become user-configurable once we get to the config object.
const DURATION_MS = 1000;
const EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

const getRow = (id: string, gridId: string) => {
  const query = `[data-ln-gridid="${gridId}"][data-ln-row="true"][data-ln-row-id="${id}"]`;

  const row = document.querySelector(query) as HTMLElement | null;

  return row;
};

export function RowAnimationDriver() {
  const rowLayout = useRowLayoutContext();
  const prevRowLayout = useRef(rowLayout);

  const gridId = useGridIdContext();

  const view = useRowViewContext();
  const prevViewRef = useRef(view);

  const yPositions = useYCoordinates();
  const rs = useRowSourceContext();

  const { topCount, bottomCount, rowCount } = useRowCountsContext();
  const { startAnimating, stopAnimating } = useAnimatingRowsContext();

  // Per-id in-flight animation, so a second move arriving before the first settles redirects
  // from wherever the row actually is right now, instead of restarting from its last classified
  // position.
  const animations = useRef<Map<string, Animation>>(new Map());

  const idToPosition = useMemo(() => {
    const x: Record<string, PositionEntry> = {};
    const bottomCutoff = rowCount - bottomCount;

    for (let i = 0; i < yPositions.length - 1; i++) {
      const row = rs.rowByIndex(i);
      const id = row.get()?.id;
      if (!id) continue;

      const pin: RowPin = i < topCount ? "top" : i >= bottomCutoff ? "bottom" : null;
      x[id] = { y: yPositions[i], pin };
    }

    return x;
  }, [rs, yPositions, topCount, bottomCount, rowCount]);

  const prevIdToPosition = useRef(idToPosition);

  useIsoEffect(() => {
    // we need to track the previous layout to get a reference to the row node, since it might've been deleted from the current
    // node? Maybe for deleted nodes we actually just clone the element and animate it out. Essentially it becomes frozen in space then? ?
    const prevLayout = prevRowLayout.current;
    prevRowLayout.current = rowLayout;

    const prev = prevIdToPosition.current;
    prevIdToPosition.current = idToPosition;

    const prevView = prevViewRef.current;
    prevViewRef.current = view;

    const moved: { id: string; from: number; to: number }[] = [];
    const removed: { id: string; pin: RowPin }[] = [];
    const added: { id: string; pin: RowPin }[] = [];

    const candidateIds = new Set<string>();
    for (const r of view.top) candidateIds.add(r.id);
    for (const r of view.center) candidateIds.add(r.id);
    for (const r of view.bottom) candidateIds.add(r.id);
    for (const r of prevView.top) candidateIds.add(r.id);
    for (const r of prevView.center) candidateIds.add(r.id);
    for (const r of prevView.bottom) candidateIds.add(r.id);

    for (const id of candidateIds) {
      const current = idToPosition[id];
      const previous = prev[id];

      if (current && previous) {
        if (current.pin !== previous.pin) {
          removed.push({ id, pin: previous.pin });
          added.push({ id, pin: current.pin });
        } else if (current.y !== previous.y) {
          moved.push({ id, from: previous.y, to: current.y });
        }
      } else if (current && !previous) {
        added.push({ id, pin: current.pin });
      } else if (!current && previous) {
        removed.push({ id, pin: previous.pin });
      }
    }

    for (const m of moved) {
      animateMove(m.id, m.from, m.to);
    }

    function animateMove(id: string, fromY: number, toY: number) {
      const el = getRow(id, gridId);
      if (!el) return;

      // If this id already has something in flight, capture where it actually is right now (not
      // where it was headed) before cancelling it, so the new animation redirects smoothly
      // instead of snapping back to rest first.
      const existing = animations.current.get(id);
      let fromTransform: string | null = null;
      if (existing) {
        try {
          existing.commitStyles();
          fromTransform = el.style.transform || null;
        } catch {
          // The animation may no longer be associated with this element; fall back below.
        }

        existing.cancel();
        animations.current.delete(id);
      }

      if (fromTransform == null) {
        const delta = fromY - toY;
        if (delta === 0) return;

        fromTransform = `translateY(${delta}px)`;
      }

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
            // commitStyles() (used above to redirect mid-flight) bakes the transform directly
            // into the element's inline style. The animation's own "transform: none" keyframe
            // only applies while it's active/relevant - once it finishes (fill: "none", the
            // default), the computed style falls back to whatever's still sitting in the inline
            // style, which is that committed value, not "none". Without clearing it here, any row
            // that was ever redirected mid-flight is left permanently offset after settling.
            el.style.transform = "";
            stopAnimating(id);
          }
        });
    }
  }, [idToPosition, view, gridId, startAnimating, stopAnimating]);

  return <></>;
}
