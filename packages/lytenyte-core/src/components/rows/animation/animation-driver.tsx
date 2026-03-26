import { memo, useLayoutEffect, useRef } from "react";
import { useRoot, useRowLayout } from "../../../root/root-context.js";
import { useGridId } from "../../../root/contexts/grid-id.js";
import { getChangedRows } from "./get-changed-rows.js";
import { getMovedDescriptions } from "./get-moved-description.js";
import { getCurrentYOffsetAndCancelInflight } from "./get-current-y-offset.js";

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
  move: { duration: 300, easing: "ease-in-out" },
  enter: { duration: 280, easing: "linear" },
  exit: { duration: 180, easing: "linear" },
} satisfies Required<AnimationConfig>;

const AnimationDriverImpl = memo(function AnimationDriver() {
  const { animate, idToPositions, dimensions } = useRoot();
  const gridId = useGridId();
  const layout = useRowLayout();
  const config = typeof animate === "boolean" ? DEFAULTS : animate;

  const prevLayoutRef = useRef(layout);
  const prevPositionsRef = useRef(idToPositions);

  useLayoutEffect(() => {
    const start = performance.now();
    // There has been no movement, and no row changes
    if (prevPositionsRef.current === idToPositions) return;

    const prevLayout = prevLayoutRef.current;
    const prevIds = prevPositionsRef.current;

    prevPositionsRef.current = idToPositions;
    prevLayoutRef.current = layout;

    // Determine the moved IDs
    const { moved } = getChangedRows(layout, prevLayout, idToPositions, prevIds);
    const movedElements = getMovedDescriptions(gridId, moved, idToPositions, prevIds);

    const moveSpec = config.move as AnimationSpec;
    const duration = moveSpec.duration ?? 300;
    const easing = moveSpec.easing ?? "ease-in-out";
    const maxDelta = dimensions.innerHeight * 1.5;

    for (const x of movedElements) {
      const el = x.element;
      if (!el) continue;

      if (el.dataset.lnRowpin !== "center") continue;

      // For interrupted animations: read the current mid-animation Y offset so we
      // continue smoothly from where the element visually is rather than snapping back.
      const currentAnimY = getCurrentYOffsetAndCancelInflight(el);

      // Cap the delta so off-screen rows don't fly in from very far away.
      const clampedDelta = Math.sign(x.delta) * Math.min(Math.abs(x.delta), maxDelta);

      // FLIP invert: for a fresh animation currentAnimY=0 so startY=-delta (classic FLIP).
      // For an interrupted animation startY continues from the mid-flight visual position.
      const startY = currentAnimY - clampedDelta;

      // Start the animation directly in useLayoutEffect (before paint) so the browser
      // applies the t=0 keyframe in this same frame. Using RAF here would clear the
      // inline transform one frame too late, causing the new position to flash briefly.
      const anim = el.animate([{ transform: `translateY(${startY}px)` }, { transform: "translateY(0)" }], {
        duration,
        easing,
        fill: "none",
      });
      anim.addEventListener("finish", () => {
        // el.style.willChange = "";
      });
    }

    // const prevCenterIds = new Set(layout.center.)

    const end = performance.now();
    console.log("Animation compute time: ", end - start);
  }, [config.move, dimensions.innerHeight, gridId, idToPositions, layout]);

  return null;
});

export function AnimationDriver() {
  const { animate } = useRoot();
  if (!animate) return null;

  return <AnimationDriverImpl />;
}
