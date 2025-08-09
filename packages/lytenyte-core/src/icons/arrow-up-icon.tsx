import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgArrowUpIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M5.216 7.994 10 3.21m0 0 4.784 4.784M10 3.21v13.482"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgArrowUpIcon);
export default ForwardRef;
