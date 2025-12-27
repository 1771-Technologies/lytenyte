import { useMemo, useRef, useState } from "react";
import {
  computeBounds,
  equal,
  type ColumnView,
  type RowSource,
  type SpanLayout,
} from "@1771technologies/lytenyte-shared";
import { useIsoEffect } from "../../hooks/use-iso-effect.js";
import { usePiece } from "../../hooks/use-piece.js";
import type { Root } from "../root";

export function useBounds(
  props: Root.Props,
  source: RowSource,
  view: ColumnView,
  viewport: HTMLElement | null,
  width: number,
  height: number,
  xPositions: Uint32Array,
  yPositions: Uint32Array,
) {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const topCount = source.useTopCount();
  const bottomCount = source.useBottomCount();

  const prev = useRef<SpanLayout>(null as unknown as SpanLayout);

  const bounds = useMemo(() => {
    const bounds = computeBounds({
      viewportWidth: width,
      viewportHeight: height,
      scrollTop,
      scrollLeft,
      xPositions,
      yPositions,
      startCount: view.startCount,
      endCount: view.endCount,
      topCount,
      bottomCount,
      colOverscanStart: props.colOverscanStart ?? 3,
      colOverscanEnd: props.colOverscanEnd ?? 3,
      rowOverscanTop: props.rowOverscanTop ?? 10,
      rowOverscanBottom: props.rowOverscanBottom ?? 10,
    });

    if (equal(bounds, prev.current)) return prev.current;

    prev.current = bounds;
    return bounds;
  }, [
    bottomCount,
    height,
    props.colOverscanEnd,
    props.colOverscanStart,
    props.rowOverscanBottom,
    props.rowOverscanTop,
    scrollLeft,
    scrollTop,
    topCount,
    view.endCount,
    view.startCount,
    width,
    xPositions,
    yPositions,
  ]);

  useIsoEffect(() => {
    if (!viewport) return;
    const controller = new AbortController();

    let frame: number | null = null;
    viewport.addEventListener("scroll", () => {
      if (frame) return;

      frame = requestAnimationFrame(() => {
        setScrollTop(viewport.scrollTop);
        setScrollLeft(Math.abs(viewport.scrollLeft));
        frame = null;
      });
    });

    return () => controller.abort();
  }, [viewport]);

  const piece = usePiece(bounds);

  return piece;
}
