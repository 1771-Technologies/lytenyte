import type { ReactNode } from "react";
import type { Root } from "../../root/root.js";

export type AnnotationIndexOrId = number | string;

export type AnnotationAnchorRange = {
  readonly kind: "range";
  readonly rowStart: AnnotationIndexOrId;
  readonly rowEnd: AnnotationIndexOrId;
  readonly colStart: AnnotationIndexOrId;
  readonly colEnd: AnnotationIndexOrId;
};

export type AnnotationAnchorPoint = {
  readonly kind: "point";
  readonly x: number;
  readonly y: number;
};

export type AnnotationAnchorHeader = {
  readonly kind: "header";
  readonly colStart: AnnotationIndexOrId;
  readonly colEnd: AnnotationIndexOrId;
};

export type AnnotationAnchor = AnnotationAnchorRange | AnnotationAnchorPoint | AnnotationAnchorHeader;

export type Annotation<Spec extends Root.GridSpec = Root.GridSpec> = {
  readonly id: string;
  readonly anchor: AnnotationAnchor;
  readonly render: (params: { readonly api: Root.API<Spec> }) => ReactNode;
  readonly zIndex?: number;
};
