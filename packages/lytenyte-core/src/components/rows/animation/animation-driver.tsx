import { memo, useLayoutEffect, useRef } from "react";
import { useRoot, useRowLayout } from "../../../root/root-context.js";
import { useGridId } from "../../../root/contexts/grid-id.js";
import { getChangedRows } from "./get-changed-rows.js";
import { getMovedDescriptions } from "./get-moved-description.js";
import { getCurrentYOffsetAndCancelInflight } from "./get-current-y-offset.js";
import { useChangedRows } from "../../../root/contexts/animation/animation.js";

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

  const changed = useChangedRows();

  const prevLayoutRef = useRef(layout);
  const prevPositionsRef = useRef(idToPositions);

  useLayoutEffect(() => {
    const start = performance.now();
    // There has been no movement, and no row changes
    if (prevPositionsRef.current === idToPositions) return;

    const prevIds = prevPositionsRef.current;

    prevPositionsRef.current = idToPositions;
    prevLayoutRef.current = layout;

    // Determine the moved IDs
    const movedElements = getMovedDescriptions(gridId, changed.moved, idToPositions, prevIds);

    const moveSpec = config.move as AnimationSpec;
    const duration = 2000;
    const easing = moveSpec.easing ?? "ease-in-out";

    for (const x of movedElements) {
      const el = x.element;
      if (!el) continue;

      if (el.dataset.lnRowpin !== "center") continue;

      // For interrupted animations: read the current mid-animation Y offset so we
      // continue smoothly from where the element visually is rather than snapping back.
      const currentAnimY = getCurrentYOffsetAndCancelInflight(el);

      // Cap the delta so off-screen rows don't fly in from very far away.

      // FLIP invert: for a fresh animation currentAnimY=0 so startY=-delta (classic FLIP).
      // For an interrupted animation startY continues from the mid-flight visual position.
      const startY = -x.delta;

      if (x.id === "0") console.log(idToPositions.get(x.id)! - prevIds.get(x.id)!, x.delta);
      // Start the animation directly in useLayoutEffect (before paint) so the browser
      // applies the t=0 keyframe in this same frame. Using RAF here would clear the
      // inline transform one frame too late, causing the new position to flash briefly.
      el.style.willChange = "transform";
      const anim = el.animate([{ transform: `translateY(${startY}px)` }, { transform: "translateY(0)" }], {
        duration,
        easing,
        fill: "none",
      });
      anim.addEventListener("finish", () => {
        el.style.willChange = "";
      });
    }

    const end = performance.now();
    console.log("Animation compute time: ", end - start);
  }, [
    changed.added,
    changed.moved,
    config.enter,
    config.move,
    dimensions.innerHeight,
    gridId,
    idToPositions,
    layout,
  ]);

  return null;
});

export function AnimationDriver() {
  const { animate } = useRoot();
  if (!animate) return null;

  return <AnimationDriverImpl />;
}
