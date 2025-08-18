import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgNumberIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 21"
    ref={ref}
    {...props}
  >
    <path
      fill="currentcolor"
      d="M2.67 13.61H5.39l-.812 3.713a1.3 1.3 0 0 0-.027.263c0 .402.303.624.723.624.428 0 .74-.214.83-.616l.874-3.984h4.22l-.81 3.713a.9.9 0 0 0-.036.263c0 .402.303.624.732.624.428 0 .74-.214.83-.616l.864-3.984h3.186c.49 0 .83-.328.83-.772a.645.645 0 0 0-.67-.657H13.1l.947-4.337h3.123c.491 0 .83-.328.83-.772a.645.645 0 0 0-.67-.657h-2.97l.73-3.31c.01-.05.027-.156.027-.262 0-.403-.312-.633-.74-.633-.5 0-.723.254-.812.64l-.785 3.565H8.559l.732-3.31a1.6 1.6 0 0 0 .026-.262c0-.403-.321-.633-.74-.633-.509 0-.741.254-.822.64L6.97 6.416H4.044c-.491 0-.83.345-.83.797 0 .37.267.632.67.632h2.774l-.946 4.337H2.83c-.491 0-.83.345-.83.797 0 .37.268.632.67.632m4.621-1.429.956-4.337h4.22l-.955 4.337z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgNumberIcon);
export default ForwardRef;
