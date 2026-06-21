import { useMemo, type CSSProperties } from "react";
import {
  splitRect,
  topSection,
  centerSection,
  bottomSection,
  type SectionedRect,
} from "@1771technologies/lytenyte-shared";
import {
  useCutoffContext,
  useRowSourceContext,
  useColumnsContext,
} from "@1771technologies/lytenyte-core/internal";
import { AnnotationRect } from "./annotation-rect.js";
import { AnnotationPointRect } from "./annotation-point-rect.js";
import { resolveRowIndex, resolveColumnIndex, useColumnIdToIndex } from "./resolve-anchor.js";
import type { Annotation } from "./types.js";

interface SplitAnnotation {
  readonly rect: SectionedRect;
  readonly annotation: Annotation<any>;
}

const wrapperStyle: CSSProperties = {
  width: "100%",
  height: 0,
  display: "grid",
  gridTemplateRows: "0px",
  gridTemplateColumns: "0px",
};

function useSplitRangeAnnotations(annotations: readonly Annotation<any>[]): SplitAnnotation[] {
  const { startCutoff, endCutoff, topCutoff, bottomCutoff } = useCutoffContext();
  const rowSource = useRowSourceContext();
  const { view } = useColumnsContext();
  const colIdToIndex = useColumnIdToIndex(view.visibleColumns);

  return useMemo(() => {
    const result: SplitAnnotation[] = [];

    for (const annotation of annotations) {
      if (annotation.anchor.kind !== "range") continue;

      const rowStart = resolveRowIndex(annotation.anchor.rowStart, rowSource);
      const rowEnd = resolveRowIndex(annotation.anchor.rowEnd, rowSource);
      const colStart = resolveColumnIndex(annotation.anchor.colStart, colIdToIndex);
      const colEnd = resolveColumnIndex(annotation.anchor.colEnd, colIdToIndex);
      if (rowStart == null || rowEnd == null || colStart == null || colEnd == null) continue;

      const rects = splitRect(
        { rowStart, rowEnd, columnStart: colStart, columnEnd: colEnd },
        startCutoff,
        endCutoff,
        topCutoff,
        bottomCutoff,
      );

      for (const rect of rects) result.push({ rect, annotation });
    }

    return result;
  }, [annotations, startCutoff, endCutoff, topCutoff, bottomCutoff, rowSource, colIdToIndex]);
}

export function AnnotationRowSectionTop({
  annotations,
}: {
  readonly annotations: readonly Annotation<any>[];
}) {
  const split = useSplitRangeAnnotations(annotations);
  const topSplit = useMemo(() => split.filter((s) => topSection[s.rect.section]), [split]);

  return (
    <div role="presentation" style={wrapperStyle}>
      {topSplit.map((s, i) => (
        <AnnotationRect key={`${s.annotation.id}-${i}`} rect={s.rect} annotation={s.annotation} />
      ))}
    </div>
  );
}

export function AnnotationRowSectionBottom({
  annotations,
}: {
  readonly annotations: readonly Annotation<any>[];
}) {
  const split = useSplitRangeAnnotations(annotations);
  const bottomSplit = useMemo(() => split.filter((s) => bottomSection[s.rect.section]), [split]);

  return (
    <div role="presentation" style={wrapperStyle}>
      {bottomSplit.map((s, i) => (
        <AnnotationRect key={`${s.annotation.id}-${i}`} rect={s.rect} annotation={s.annotation} />
      ))}
    </div>
  );
}

export function AnnotationRowSectionCenter({
  annotations,
}: {
  readonly annotations: readonly Annotation<any>[];
}) {
  const split = useSplitRangeAnnotations(annotations);
  const centerSplit = useMemo(() => split.filter((s) => centerSection[s.rect.section]), [split]);

  const points = useMemo(() => annotations.filter((a) => a.anchor.kind === "point"), [annotations]);

  return (
    <div role="presentation" style={wrapperStyle}>
      {centerSplit.map((s, i) => (
        <AnnotationRect key={`${s.annotation.id}-${i}`} rect={s.rect} annotation={s.annotation} />
      ))}
      {points.map((a) => (
        <AnnotationPointRect
          key={a.id}
          anchor={a.anchor as Extract<Annotation<any>["anchor"], { kind: "point" }>}
          annotation={a}
        />
      ))}
    </div>
  );
}
