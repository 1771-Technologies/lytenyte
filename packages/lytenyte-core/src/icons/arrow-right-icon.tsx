import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgArrowRightIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11.957 5.167 16.74 9.95m0 0-4.784 4.784M16.74 9.95H3.259"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgArrowRightIcon);
export default ForwardRef;
