import {
  forwardRef,
  Fragment,
  memo,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type JSX,
  type ReactNode,
} from "react";
import { useCombinedRefs } from "@1771technologies/lytenyte-core/internal";
import { PillRootProvider, type PillRootContext } from "./root.context.js";
import type { PillItemSpec, PillRowSpec } from "./types.js";
import { PillRowDefault } from "./row-default.js";

function PillRootImpl(
  {
    children = PillRowDefault,
    rows,
    orientation,
    onPillRowChange,
    onPillItemActiveChange,
    onPillItemThrown,
    ...p
  }: PillManager.Props,
  ref: PillManager.Props["ref"],
) {
  const [cloned, setCloned] = useState<PillRowSpec[] | null>(null);
  const [dragState, setDragState] = useState<{
    readonly activeId: string;
    readonly activeRow: string;
    readonly activeType: string;
  } | null>(null);

  const prevSwapId = useRef<string | null>(null);
  const prevRowId = useRef<string | null>(null);
  const movedRef = useRef<{ id: string; pillId: string } | null>(null);

  const rootElRef = useRef<HTMLDivElement | null>(null);
  const snapshotRef = useRef<Map<string, DOMRect>>(new Map());
  const animationsRef = useRef<Map<string, Animation>>(new Map());

  const value = useMemo<PillRootContext>(() => {
    return {
      orientation: orientation ?? "horizontal",
      cloned,
      setCloned,
      rows: rows,

      dragState,
      setDragState,

      movedRef,
      prevSwapId,
      prevRowId,

      onPillItemActiveChange: onPillItemActiveChange ?? (() => {}),
      onPillRowChange: onPillRowChange ?? (() => {}),
      onPillItemThrown: onPillItemThrown ?? (() => {}),
    };
  }, [cloned, dragState, onPillItemActiveChange, onPillItemThrown, onPillRowChange, orientation, rows]);

  const rendered = useMemo(() => {
    const r = cloned ?? rows;
    return r.map((x, i) => <Fragment key={i}>{children(x, value)}</Fragment>);
  }, [children, cloned, rows, value]);

  // FLIP "First": capture pill positions before this render's DOM commit.
  // useMemo runs during render, before React's mutation phase, so rootElRef.current
  // still reflects the previous layout — exactly the "before" positions we need.
  // Only snapshot when cloned is non-null (drag is active and a reorder just occurred).
  useMemo(() => {
    const el = rootElRef.current;
    if (!el || cloned == null) return;
    const snap = new Map<string, DOMRect>();
    el.querySelectorAll<HTMLElement>("[data-ln-pill-id]").forEach((pillEl) => {
      // Key by "rowId:pillId" — pill IDs are only unique within a row, not across rows.
      const key = `${pillEl.getAttribute("data-ln-pill-row-id")}:${pillEl.getAttribute("data-ln-pill-id")}`;
      snap.set(key, pillEl.getBoundingClientRect());
    });
    snapshotRef.current = snap;
  }, [cloned]);

  // FLIP "Last + Invert + Play": after React commits the new DOM order, measure new
  // positions, compute the delta from the snapshot, and animate from delta → none.
  useLayoutEffect(() => {
    const el = rootElRef.current;
    if (!el || cloned == null) return;

    el.querySelectorAll<HTMLElement>("[data-ln-pill-id]").forEach((pillEl) => {
      const pillId = pillEl.getAttribute("data-ln-pill-id")!;
      const rowId = pillEl.getAttribute("data-ln-pill-row-id")!;
      const key = `${rowId}:${pillId}`;

      const oldRect = snapshotRef.current.get(key);
      if (!oldRect) return;

      const newRect = pillEl.getBoundingClientRect();
      const existing = animationsRef.current.get(key);

      let dx: number;
      let dy: number;

      if (existing) {
        try {
          existing.commitStyles();
          const xm = /translateX\(([-\d.]+)px\)/.exec(pillEl.style.transform);
          const ym = /translateY\(([-\d.]+)px\)/.exec(pillEl.style.transform);
          dx = (xm ? parseFloat(xm[1]) : 0) + (oldRect.left - newRect.left);
          dy = (ym ? parseFloat(ym[1]) : 0) + (oldRect.top - newRect.top);
        } catch {
          dx = oldRect.left - newRect.left;
          dy = oldRect.top - newRect.top;
        }
      } else {
        dx = oldRect.left - newRect.left;
        dy = oldRect.top - newRect.top;
      }

      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;

      pillEl.style.transform = "none";

      const from = `translateX(${dx}px) translateY(${dy}px)`;
      if (existing) {
        (existing.effect as KeyframeEffect | null)?.setKeyframes([
          { transform: from },
          { transform: "none" },
        ]);
        existing.currentTime = 0;
        existing.play();
        return;
      }

      const anim = pillEl.animate([{ transform: from }, { transform: "none" }], {
        duration: 200,
        easing: "ease-out",
      });
      animationsRef.current.set(key, anim);
      anim.finished
        .catch(() => {})
        .finally(() => {
          if (animationsRef.current.get(key) === anim) {
            animationsRef.current.delete(key);
            pillEl.style.transform = "";
          }
        });
    });
  }, [cloned]);

  const combined = useCombinedRefs(ref, rootElRef);

  return (
    <PillRootProvider value={value}>
      <div {...p} ref={combined} data-ln-pill-root data-ln-orientation={orientation ?? "horizontal"}>
        {rendered}
      </div>
    </PillRootProvider>
  );
}

export const PillManager = memo(forwardRef(PillRootImpl));

export namespace PillManager {
  export type Props = Omit<JSX.IntrinsicElements["div"], "children"> & {
    readonly rows: PillRowSpec[];
    readonly orientation?: "horizontal" | "vertical";
    readonly children?: (row: PillRowSpec, ctx: PillRootContext) => ReactNode;

    readonly onPillRowChange?: (params: {
      readonly changed: PillRowSpec[];
      readonly full: PillRowSpec[];
    }) => void;

    readonly onPillItemActiveChange?: (params: {
      readonly index: number;
      readonly item: PillItemSpec;
      readonly row: PillRowSpec;
    }) => void;

    readonly onPillItemThrown?: (params: {
      readonly index: number;
      readonly item: PillItemSpec;
      readonly row: PillRowSpec;
    }) => void;
  };
}
