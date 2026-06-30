import type { Annotation } from "../../types.js";

export interface AnnotationBorderOptions {
  readonly color?: string;
  readonly width?: number;
}

export function annotationBorder(options?: AnnotationBorderOptions): Annotation<any>["render"] {
  const color = options?.color ?? "#3b82f6";
  const width = options?.width ?? 2;

  return () => (
    <div
      style={{
        position: "absolute",
        inset: 0,
        boxSizing: "border-box",
        border: `${width}px solid ${color}`,
      }}
    />
  );
}
