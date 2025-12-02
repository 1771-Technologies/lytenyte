import { computeBounds, equal, type SpanLayout } from "@1771technologies/lytenyte-shared";
import { boundsContext } from "./context.js";
import { memo, useMemo, useRef, useState, type PropsWithChildren } from "react";
import { useIsoEffect } from "../../hooks/use-iso-effect.js";
import { usePiece } from "../../hooks/use-piece.js";
import type { RowSource } from "../../types/row.js";

export interface BoundsProviderProps {
  readonly rowOverscanTop: number;
  readonly rowOverscanBottom: number;
  readonly colOverscanStart: number;
  readonly colOverscanEnd: number;
  readonly startCount: number;
  readonly endCount: number;
  readonly viewport: HTMLDivElement | null;
  readonly viewportWidth: number;
  readonly viewportHeight: number;
  readonly yPositions: Uint32Array;
  readonly xPositions: Uint32Array;
  readonly rowSource: RowSource;
}

function BoundsProviderBase({
  viewportWidth,
  viewportHeight,
  xPositions,
  yPositions,
  startCount,
  endCount,
  colOverscanEnd,
  colOverscanStart,
  rowOverscanBottom,
  rowOverscanTop,
  viewport,
  rowSource,
  children,
}: PropsWithChildren<BoundsProviderProps>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const topCount = rowSource.useTopCount();
  const bottomCount = rowSource.useBottomCount();

  const prev = useRef<SpanLayout>(null as unknown as SpanLayout);

  const bounds = useMemo(() => {
    const bounds = computeBounds({
      viewportWidth,
      viewportHeight,
      scrollTop,
      scrollLeft,
      xPositions,
      yPositions,
      startCount,
      endCount,
      topCount,
      bottomCount,
      colOverscanStart,
      colOverscanEnd,
      rowOverscanTop,
      rowOverscanBottom,
    });

    // Track the previous bounds so we can return it if the objects are equal. We need to do
    // this to ensure that the we don't re-render unnecessarily.
    if (equal(bounds, prev.current)) return prev.current;

    prev.current = bounds;
    return bounds;
  }, [
    bottomCount,
    colOverscanEnd,
    colOverscanStart,
    endCount,
    rowOverscanBottom,
    rowOverscanTop,
    scrollLeft,
    scrollTop,
    startCount,
    topCount,
    viewportHeight,
    viewportWidth,
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

  return <boundsContext.Provider value={piece}>{children}</boundsContext.Provider>;
}

export const BoundsProvider = memo(BoundsProviderBase);
