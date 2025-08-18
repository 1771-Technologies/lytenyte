import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgMoreVerticalIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      fillRule="evenodd"
      d="M11.5 3.96a1.75 1.75 0 1 0-3.5 0 1.75 1.75 0 0 0 3.5 0M9.75 8.21a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5m0 6a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgMoreVerticalIcon);
export default ForwardRef;
