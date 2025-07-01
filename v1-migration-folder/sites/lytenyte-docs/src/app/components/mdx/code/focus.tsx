import { AnnotationHandler, InnerLine } from "codehike/code";

export const focus: AnnotationHandler = {
  name: "focus",
  onlyIfAnnotated: true,
  Line: (props) => {
    return <InnerLine merge={props} className="code-focus" />;
  },
  AnnotatedLine: ({ annotation, ...props }) => <InnerLine merge={props} data-focus={true} />,
};
