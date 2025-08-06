import { AnnotationHandler, InnerLine } from "codehike/code";
import { CSSProperties } from "react";

export const mark: AnnotationHandler = {
  name: "mark",
  Line: ({ annotation, ...props }) => {
    const color = annotation?.query;
    return (
      <div
        className="flex"
        data-highlighted={annotation?.name === "mark" ? true : undefined}
        style={
          {
            "--highlight-color": color,
          } as CSSProperties
        }
      >
        <InnerLine merge={props} className="flex-1" />
      </div>
    );
  },
  Inline: ({ annotation, children }) => {
    const color = annotation?.query || "rgb(14 165 233)";
    return (
      <span
        className="-mx-0.5 rounded px-0.5 py-0"
        style={{
          outline: `solid 1px rgb(from ${color} r g b / 0.5)`,
          background: `rgb(from ${color} r g b / 0.13)`,
        }}
      >
        {children}
      </span>
    );
  },
};
