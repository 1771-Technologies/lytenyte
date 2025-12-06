import { useEffect, useState, useRef, useMemo } from "react";
import type {
  HTMLOrSVGElement,
  RectReadOnly,
  UseMeasureState,
  UseMeasureResult,
  UseMeasureOptions,
} from "./+types";
import { debounce as createDebounce, equal } from "@1771technologies/lytenyte-shared";
import { useOnWindowResize } from "../use-on-window-resize.js";
import { useOnWindowScroll } from "../use-on-window-scroll.js";
import { useEvent } from "../use-event.js";

// Fork off: https://www.npmjs.com/package/react-use-measure
/* v8 ignore next 9999 */
export function useMeasure(
  { debounce, scroll, offsetSize, onChange }: UseMeasureOptions = {
    debounce: 0,
    scroll: false,
    offsetSize: false,
  },
): UseMeasureResult {
  const ResizeObserver =
    typeof window === "undefined" ? class ResizeObserver {} : (window as any).ResizeObserver;

  const [bounds, set] = useState<RectReadOnly>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0,
  });

  // keep all state in a ref
  const state = useRef<UseMeasureState>({
    element: null,
    scrollContainers: null,
    resizeObserver: null,
    lastBounds: bounds,
    orientationHandler: null,
  });

  // set actual debounce values early, so effects know if they should react accordingly
  const scrollDebounce = debounce
    ? typeof debounce === "number"
      ? debounce
      : debounce.scroll
    : null;
  const resizeDebounce = debounce
    ? typeof debounce === "number"
      ? debounce
      : debounce.resize
    : null;

  // make sure to update state only as long as the component is truly mounted
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => void (mounted.current = false);
  });

  // memoize handlers, so event-listeners know when they should update
  const [forceRefresh, resizeChange, scrollChange] = useMemo(() => {
    const callback = () => {
      if (!state.current.element) return;
      const { left, top, width, height, bottom, right, x, y } =
        state.current.element.getBoundingClientRect() as unknown as RectReadOnly;

      const size = {
        left,
        top,
        width,
        height,
        bottom,
        right,
        x,
        y,
      };

      if (state.current.element instanceof HTMLElement && offsetSize) {
        size.height = state.current.element.offsetHeight;
        size.width = state.current.element.offsetWidth;
      }

      if (mounted.current && !equal(state.current.lastBounds, size)) {
        onChange?.(size, state.current.lastBounds);
        set((state.current.lastBounds = size));
      }
    };
    return [
      callback,
      resizeDebounce ? createDebounce(callback, resizeDebounce) : callback,
      scrollDebounce ? createDebounce(callback, scrollDebounce) : callback,
    ];
  }, [resizeDebounce, scrollDebounce, offsetSize, onChange]);

  // cleanup current scroll-listeners / observers
  function removeListeners() {
    if (state.current.scrollContainers) {
      state.current.scrollContainers.forEach((element) =>
        element.removeEventListener("scroll", scrollChange, true),
      );
      state.current.scrollContainers = null;
    }

    if (state.current.resizeObserver) {
      state.current.resizeObserver.disconnect();
      state.current.resizeObserver = null;
    }

    if (state.current.orientationHandler) {
      if ("orientation" in screen && "removeEventListener" in screen.orientation) {
        screen.orientation.removeEventListener("change", state.current.orientationHandler);
      } else if ("onorientationchange" in window) {
        window.removeEventListener("orientationchange", state.current.orientationHandler);
      }
    }
  }

  // add scroll-listeners / observers
  function addListeners() {
    if (!state.current.element) return;
    state.current.resizeObserver = new ResizeObserver(scrollChange);
    state.current.resizeObserver!.observe(state.current.element);
    if (scroll && state.current.scrollContainers) {
      state.current.scrollContainers.forEach((scrollContainer) =>
        scrollContainer.addEventListener("scroll", scrollChange, { capture: true, passive: true }),
      );
    }

    // Handle orientation changes
    state.current.orientationHandler = () => {
      scrollChange();
    };

    // Use screen.orientation if available
    if ("orientation" in screen && "addEventListener" in screen.orientation) {
      screen.orientation.addEventListener("change", state.current.orientationHandler);
    } else if ("onorientationchange" in window) {
      // Fallback to orientationchange event
      window.addEventListener("orientationchange", state.current.orientationHandler);
    }
  }

  // the ref we expose to the user
  const ref = useEvent((node: HTMLOrSVGElement | null) => {
    if (!node || node === state.current.element) return;
    removeListeners();
    state.current.element = node;
    state.current.scrollContainers = findScrollContainers(node);
    addListeners();
  });

  // add general event listeners
  useOnWindowScroll(scrollChange, Boolean(scroll));
  useOnWindowResize(resizeChange);

  // respond to changes that are relevant for the listeners
  useEffect(() => {
    removeListeners();
    addListeners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scroll, scrollChange, resizeChange]);

  // remove all listeners when the components unmounts
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => removeListeners, []);
  return [ref, bounds, forceRefresh, state.current.element];
}

// Returns a list of scroll offsets
function findScrollContainers(element: HTMLOrSVGElement | null): HTMLOrSVGElement[] {
  const result: HTMLOrSVGElement[] = [];
  if (!element || element === document.body) return result;
  const { overflow, overflowX, overflowY } = window.getComputedStyle(element);
  if ([overflow, overflowX, overflowY].some((prop) => prop === "auto" || prop === "scroll"))
    result.push(element);
  return [...result, ...findScrollContainers(element.parentElement)];
}
