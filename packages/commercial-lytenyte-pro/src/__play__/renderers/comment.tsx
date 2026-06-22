import type { Annotation } from "../../types.js";

export interface AnnotationCommentOptions {
  readonly text: string;
  readonly color?: string;
}

export function annotationComment(options: AnnotationCommentOptions): Annotation<any>["render"] {
  const color = options.color ?? "#f59e0b";

  return () => (
    <div
      title={options.text}
      style={{
        position: "absolute",
        top: 0,
        insetInlineEnd: 0,
        width: 0,
        height: 0,
        borderTop: `8px solid ${color}`,
        borderInlineStart: "8px solid transparent",
        pointerEvents: "auto",
      }}
    />
  );
}
