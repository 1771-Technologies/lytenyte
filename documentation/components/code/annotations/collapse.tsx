import type { AnnotationHandler, BlockAnnotation } from "codehike/code";
import { CodeFold } from "./code-fold";

export const collapse: AnnotationHandler = {
  name: "collapse",
  transform: (annotation: BlockAnnotation) => {
    const { fromLineNumber, toLineNumber } = annotation;
    return [
      annotation,
      {
        ...annotation,
        fromLineNumber: fromLineNumber,
        toLineNumber: toLineNumber,
        name: "ColdFold",
      },
    ];
  },
  Block: ({ children }) => {
    return <CodeFold>{children}</CodeFold>;
  },
};
