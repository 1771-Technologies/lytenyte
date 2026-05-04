import { computeBounds, type RowSource, type SpanLayout } from "@1771technologies/lytenyte-shared";
import { createContext, memo, useContext, useMemo, useRef, useState, type PropsWithChildren } from "react";
import { useRowCountsContext } from "./grid-areas/row-counts-context.js";
import { useXCoordinates, useYCoordinates } from "./coordinates.js";
import { useColumnsContext } from "./columns/column-context.js";
import { useIsoEffect } from "../../hooks/use-iso-effect.js";
import { useViewportContext } from "./viewport/viewport-context.js";
import { useDimensionContext } from "./viewport/dimensions-context.js";
import { equal } from "@1771technologies/js-utils";

const boundsContext = createContext<SpanLayout>({} as any);
const startBoundsContext = createContext<[start: number, end: number]>(null as any);

export const BoundsProvider = memo(
  (
    props: PropsWithChildren<{
      colOverscanStart: number | undefined;
      colOverscanEnd: number | undefined;
      rowOverscanTop: number | undefined;
      rowOverscanBottom: number | undefined;
      source: RowSource;
    }>,
  ) => {
    const { topCount, bottomCount } = useRowCountsContext();
    const { viewport } = useViewportContext();
    const { innerHeight: height, innerWidth: width } = useDimensionContext();

    const xPositions = useXCoordinates();
    const yPositions = useYCoordinates();
    const { view } = useColumnsContext();

    const [scrollTop, setScrollTop] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

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

    const startBounds = useMemo<[start: number, end: number]>(() => {
      return [bounds.colCenterStart, bounds.colCenterEnd];
    }, [bounds.colCenterEnd, bounds.colCenterStart]);

    return (
      <boundsContext.Provider value={bounds}>
        <startBoundsContext.Provider value={startBounds}>{props.children}</startBoundsContext.Provider>
      </boundsContext.Provider>
    );
  },
);

export const useBoundsContext = () => useContext(boundsContext);
export const useStartBoundsContext = () => useContext(startBoundsContext);
