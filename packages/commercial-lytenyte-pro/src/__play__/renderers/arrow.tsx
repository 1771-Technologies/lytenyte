import type { Annotation } from "../../types.js";

export interface AnnotationArrowOptions {
  readonly direction?: "up" | "down" | "left" | "right";
  readonly color?: string;
  readonly size?: number;
}

const ROTATION: Record<NonNullable<AnnotationArrowOptions["direction"]>, number> = {
  up: 0,
  right: 90,
  down: 180,
  left: 270,
};

/** Draws an arrow pointing in the given direction, centered on the annotation's anchored area. */
export function annotationArrow(options?: AnnotationArrowOptions): Annotation<any>["render"] {
  const direction = options?.direction ?? "up";
  const color = options?.color ?? "#3b82f6";
  const size = options?.size ?? 24;

  return () => (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{ transform: `rotate(${ROTATION[direction]}deg)` }}
      >
        <path d="M12 2 L22 20 L12 15 L2 20 Z" fill={color} />
      </svg>
    </div>
  );
}
