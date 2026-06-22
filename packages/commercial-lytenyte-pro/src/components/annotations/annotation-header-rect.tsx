import { startSection, endSection, type SectionedRect } from "@1771technologies/lytenyte-shared";
import { useMemo, type CSSProperties } from "react";
import { sizeFromCoord } from "@1771technologies/js-utils";
import {
  useXCoordinates,
  useRtlContext,
  useSuppressScrollFlashContext,
  useDimensionContext,
  useAPI,
} from "@1771technologies/lytenyte-core/internal";
import type { Annotation } from "./types.js";

export function AnnotationHeaderRect({
  rect,
  annotation,
}: {
  readonly rect: SectionedRect;
  readonly annotation: Annotation<any>;
}) {
  const rtl = useRtlContext();
  const xPositions = useXCoordinates();
  const sync = useSuppressScrollFlashContext();
  const dimensions = useDimensionContext();
  const api = useAPI();

  const vpWidth = dimensions.innerWidth;

  const style = useMemo(() => {
    const isStart = startSection[rect.section];
    const isEnd = endSection[rect.section];

    const width = sizeFromCoord(rect.columnStart, xPositions, rect.columnEnd - rect.columnStart);
    const factor = rtl ? -1 : 1;

    const x = isEnd
      ? xPositions[rect.columnStart] - xPositions.at(-1)! + vpWidth
      : xPositions[rect.columnStart] * factor;

    const style: CSSProperties = {
      height: "100%",
      width,
      position: "absolute",
      pointerEvents: "none",
      top: 0,
      transform:
        sync && !(isStart || isEnd)
          ? `var(--ln-x-transform) translate3d(${x}px, 0px, 0px)`
          : `translate3d(${x}px, 0px, 0px)`,
      zIndex: 1,
    };

    if (isStart || isEnd) {
      style.position = "sticky";
      style.insetInlineStart = "0px";
      style.zIndex = 12;
    }

    return style;
  }, [rect.columnStart, rect.columnEnd, rect.section, xPositions, rtl, sync, vpWidth]);

  return (
    <div style={style} data-ln-annotation-rect data-ln-annotation-id={annotation.id}>
      {annotation.render({ api })}
    </div>
  );
}
