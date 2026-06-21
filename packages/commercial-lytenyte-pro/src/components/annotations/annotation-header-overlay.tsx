import { useMemo } from "react";
import { splitRect, type SectionedRect } from "@1771technologies/lytenyte-shared";
import { useCutoffContext, useColumnsContext } from "@1771technologies/lytenyte-core/internal";
import { AnnotationHeaderRect } from "./annotation-header-rect.js";
import { resolveColumnIndex, useColumnIdToIndex } from "./resolve-anchor.js";
import type { Annotation } from "./types.js";

export function AnnotationHeaderOverlay({
  annotations,
}: {
  readonly annotations: readonly Annotation<any>[];
}) {
  const { startCutoff, endCutoff } = useCutoffContext();
  const { view } = useColumnsContext();
  const colIdToIndex = useColumnIdToIndex(view.visibleColumns);

  const split = useMemo(() => {
    const result: { rect: SectionedRect; annotation: Annotation<any> }[] = [];

    for (const annotation of annotations) {
      if (annotation.anchor.kind !== "header") continue;

      const colStart = resolveColumnIndex(annotation.anchor.colStart, colIdToIndex);
      const colEnd = resolveColumnIndex(annotation.anchor.colEnd, colIdToIndex);
      if (colStart == null || colEnd == null) continue;

      const rects = splitRect(
        { rowStart: 0, rowEnd: 1, columnStart: colStart, columnEnd: colEnd },
        startCutoff,
        endCutoff,
        0,
        1,
      );

      for (const rect of rects) result.push({ rect, annotation });
    }

    return result;
  }, [annotations, startCutoff, endCutoff, colIdToIndex]);

  return (
    <>
      {split.map((s, i) => (
        <AnnotationHeaderRect key={`${s.annotation.id}-${i}`} rect={s.rect} annotation={s.annotation} />
      ))}
    </>
  );
}
