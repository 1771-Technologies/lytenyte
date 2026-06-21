import { useMemo, type CSSProperties } from "react";
import {
  useYCoordinates,
  useRowCountsContext,
  useRtlContext,
  useSuppressScrollFlashContext,
  useAPI,
} from "@1771technologies/lytenyte-core/internal";
import type { Annotation, AnnotationAnchorPoint } from "./types.js";

export function AnnotationPointRect({
  anchor,
  annotation,
}: {
  readonly anchor: AnnotationAnchorPoint;
  readonly annotation: Annotation<any>;
}) {
  const rtl = useRtlContext();
  const yPositions = useYCoordinates();

  const { topCount: rowTopCount } = useRowCountsContext();

  const isSync = useSuppressScrollFlashContext();

  const api = useAPI();

  const style = useMemo(() => {
    const factor = rtl ? -1 : 1;

    const x = isSync ? `calc(${anchor.x * factor}px - var(--ln-x-sync-offset,0))` : anchor.x;

    const y = isSync
      ? anchor.y - yPositions[rowTopCount]
      : `calc(${anchor.y - yPositions[rowTopCount]}px - var(--ln-y-offset, 0px))`;

    const transform = `translate3d(${typeof x === "string" ? x : `${x}px`}, ${typeof y === "string" ? y : `${y}px`}, 0px)`;

    return {
      transform,
      position: "absolute",
      pointerEvents: "none",
      top: 0,
      zIndex: 1,

      gridRowStart: "1",
      gridRowEnd: "2",
      gridColumnStart: "1",
      gridColumnEnd: "2",
    } as CSSProperties;
  }, [anchor.x, anchor.y, rtl, isSync, yPositions, rowTopCount]);

  return (
    <div style={style} data-ln-annotation-rect data-ln-annotation-id={annotation.id}>
      {annotation.render({ api })}
    </div>
  );
}
