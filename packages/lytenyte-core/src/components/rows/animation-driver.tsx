import { useLayoutEffect, useRef, memo } from "react";
import { sizeFromCoord } from "@1771technologies/lytenyte-shared";
import { useRoot, useRowLayout } from "../../root/root-context.js";
import { useRowsContainerContext } from "./rows-container/context.js";
import { useGridId } from "../../root/contexts/grid-id.js";
import { $topHeight } from "../../selectors.js";

export interface AnimationSpec {
  readonly duration?: number;
  readonly easing?: string;
}

export interface AnimationConfig {
  readonly move?: AnimationSpec | false;
  readonly enter?: AnimationSpec | false;
  readonly exit?: AnimationSpec | false;
}

// Default animation config — used when no override is passed via props.
const DEFAULTS = {
  move: { duration: 300, easing: "ease-out" },
  enter: { duration: 280, easing: "ease-out" },
  exit: { duration: 180, easing: "ease-in" },
} satisfies Required<AnimationConfig>;

interface PosEntry {
  readonly y: number;
  readonly height: number;
}

const AnimationDriverImpl = memo(function AnimationDriver({
  move: moveProp,
  enter: enterProp,
  exit: exitProp,
}: AnimationConfig) {
  const { source, yPositions, dimensions } = useRoot();
  const layout = useRowLayout();
  const container = useRowsContainerContext();
  const id = useGridId();

  const topHeight = container.useValue($topHeight);
  const rows = source.useRows();
  const viewportHeight = dimensions.innerHeight;

  // Resolve effective config: explicit prop → default. `false` means disabled.
  const moveConf = moveProp !== undefined ? moveProp : DEFAULTS.move;
  const enterConf = enterProp !== undefined ? enterProp : DEFAULTS.enter;
  const exitConf = exitProp !== undefined ? exitProp : DEFAULTS.exit;

  // ── Per-render tracking refs ─────────────────────────────────────────────
  // Keyed by data object reference (not row.id) so we survive positional IDs.
  const prevRowsRef = useRef<typeof rows>(rows);
  const prevDataPosRef = useRef<Map<unknown, PosEntry>>(new Map());
  const prevDataSetRef = useRef<Set<unknown>>(new Set());

  // Strong refs to DOM elements captured at end of each effect run.
  const prevDataElRef = useRef<Map<unknown, HTMLElement>>(new Map());

  // Cleanup fns for in-flight move/enter animations, keyed by data ref.
  const moveEnterCleanupRef = useRef<Map<unknown, () => void>>(new Map());

  // Active exit animations — lets us cancel if a row re-enters.
  const exitCleanupRef = useRef<Map<unknown, () => void>>(new Map());

  useLayoutEffect(() => {
    // ── Step 1: read snapshots from the PREVIOUS render before overwriting ──
    const prevDataPos = prevDataPosRef.current;
    const prevDataSet = prevDataSetRef.current;
    const prevDataEl = prevDataElRef.current;
    const isDataChange = prevRowsRef.current !== rows;

    const centerEl = document.querySelector<HTMLElement>(`[data-ln-rows-center][data-ln-gridid="${id}"]`);
    if (!centerEl) return;

    // ── Step 2: capture current state for NEXT render ──────────────────────
    const newDataPos = new Map<unknown, PosEntry>();
    const newDataSet = new Set<unknown>();
    const newDataEl = new Map<unknown, HTMLElement>();

    for (const row of layout.center) {
      // Resolve actual data object — works for both stable and positional IDs.
      const data = source.rowByIndex(row.rowIndex).get()?.data;
      if (data == null) continue;

      const y = yPositions[row.rowIndex];
      const height = sizeFromCoord(row.rowIndex, yPositions);
      newDataPos.set(data, { y, height });
      newDataSet.add(data);

      const el = centerEl.querySelector<HTMLElement>(`[data-ln-rowindex="${row.rowIndex}"][data-ln-row]`);
      if (el) newDataEl.set(data, el);
    }

    prevDataPosRef.current = newDataPos;
    prevRowsRef.current = rows;
    prevDataSetRef.current = newDataSet;
    prevDataElRef.current = newDataEl;

    // ── Step 3: only animate on data changes, skip scroll ───────────────────
    if (!isDataChange || prevDataPos.size === 0) return;

    const centerRect = centerEl.getBoundingClientRect();

    // ── MOVE & ENTER ─────────────────────────────────────────────────────────
    for (const row of layout.center) {
      const data = source.rowByIndex(row.rowIndex).get()?.data;
      if (data == null) continue;

      const el = newDataEl.get(data);
      if (!el) continue;

      // Cancel any running animation for this row.
      moveEnterCleanupRef.current.get(data)?.();
      moveEnterCleanupRef.current.delete(data);

      // If the row is re-entering while its exit animation is still running,
      // cancel the exit and restore the element to the grid flow.
      const activeExit = exitCleanupRef.current.get(data);
      if (activeExit) {
        activeExit();
        exitCleanupRef.current.delete(data);
      }

      const prev = prevDataPos.get(data);

      if (prev === undefined) {
        // ── ENTER ────────────────────────────────────────────────────────────
        if (enterConf === false) continue;

        // Slide in from the direction of origin: top half comes from above,
        // bottom half from below. Use the same distance as a row move so the
        // new row visually "arrives" in sync with shifting neighbours.
        const relY = yPositions[row.rowIndex] - topHeight;
        const rowH = sizeFromCoord(row.rowIndex, yPositions) || 40;
        const enterOffset = relY < viewportHeight / 2 ? -rowH : rowH;

        const t = el.animate(
          [{ transform: `translateY(${enterOffset}px)` }, { transform: "translateY(0px)" }],
          { duration: enterConf.duration, easing: enterConf.easing, composite: "add" },
        );
        const o = el.animate([{ opacity: "0" }, { opacity: "1" }], {
          duration: enterConf.duration,
          easing: enterConf.easing,
        });

        const cleanup = () => {
          t.cancel();
          o.cancel();
        };
        moveEnterCleanupRef.current.set(data, cleanup);
        void o.finished.then(() => moveEnterCleanupRef.current.delete(data)).catch(() => {});
      } else {
        // ── MOVE ─────────────────────────────────────────────────────────────
        if (moveConf === false) continue;

        const rawDelta = prev.y - yPositions[row.rowIndex];
        if (rawDelta === 0) continue;
        // Clamp so off-screen rows slide in from the nearest viewport edge
        // instead of flying across the full distance.
        const delta = Math.max(-viewportHeight, Math.min(viewportHeight, rawDelta));

        const anim = el.animate([{ transform: `translateY(${delta}px)` }, { transform: "translateY(0px)" }], {
          duration: moveConf.duration,
          easing: moveConf.easing,
          composite: "add",
        });

        moveEnterCleanupRef.current.set(data, () => anim.cancel());
        void anim.finished.then(() => moveEnterCleanupRef.current.delete(data)).catch(() => {});
      }
    }

    // ── EXIT ──────────────────────────────────────────────────────────────────
    if (exitConf === false) return;

    for (const data of prevDataSet) {
      if (newDataSet.has(data)) continue;

      const prev = prevDataPos.get(data);
      if (!prev) continue;

      // Only animate rows that were inside the visible viewport.
      const relY = prev.y - topHeight;
      if (relY < 0 || relY > viewportHeight) continue;

      // The element was removed from the grid DOM by React during this commit.
      // Its HTMLElement JS object still lives in `prevDataEl`.
      const el = prevDataEl.get(data);
      if (!el) continue;
      // If still connected, React reused this slot for a different data item
      // (positional keys + virtualization). Never steal a live element.
      if (el.isConnected) continue;

      // Cancel any prior exit for this data (shouldn't happen often, but be safe).
      exitCleanupRef.current.get(data)?.();

      // Reparent the detached element to document.body at a fixed position that
      // matches exactly where it was in the viewport.
      el.style.position = "fixed";
      el.style.top = `${centerRect.top + relY}px`;
      el.style.left = `${centerRect.left}px`;
      el.style.width = `${centerRect.width}px`;
      // height is already 0 from React — cells overflow visually, so keep it.
      el.style.transform = "none";
      el.style.pointerEvents = "none";
      el.style.zIndex = "999";
      document.body.appendChild(el);

      const anim = el.animate([{ opacity: "1" }, { opacity: "0" }], {
        duration: exitConf.duration,
        easing: exitConf.easing,
      });

      const remove = () => {
        el.remove();
        exitCleanupRef.current.delete(data);
      };

      exitCleanupRef.current.set(data, () => {
        anim.cancel();
        remove();
      });

      void anim.finished.then(remove).catch(() => {});
    }
  }); // No dependency array — runs after every render so snapshots stay fresh.

  return null;
});

export function AnimationDriver() {
  const { animate } = useRoot();
  if (!animate) return null;

  return <AnimationDriverImpl />;
}
