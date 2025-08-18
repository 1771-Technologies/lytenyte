import { useEvent } from "@1771technologies/lytenyte-react-hooks";
import { useEffect, useRef } from "react";
import { dragState, isTouchDragAtom, store } from "../+globals.js";
import { useAtomValue } from "@1771technologies/atom";
import { scrollContainers } from "./scroll-containers.js";

type UseAutoScrollOptions = {
  margin?: number;
  speed?: number;
};

export function useAutoScroll({ margin = 10, speed = 10 }: UseAutoScrollOptions = {}) {
  const coords = dragState.position.use();
  const isTouch = useAtomValue(isTouchDragAtom, { store });
  const animationRef = useRef<number | null>(null);

  const scrollLoop = useEvent(() => {
    if (!coords || !isTouch) return;

    /* v8 ignore next 2 */
    scrollContainers(coords, margin, speed);
    animationRef.current = requestAnimationFrame(scrollLoop);
  });

  useEffect(() => {
    if (coords) {
      if (animationRef.current === null) {
        animationRef.current = requestAnimationFrame(scrollLoop);
      }
    } else {
      /* v8 ignore next 4 */
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      /* v8 ignore next 4 */
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [coords, scrollLoop]);
}
