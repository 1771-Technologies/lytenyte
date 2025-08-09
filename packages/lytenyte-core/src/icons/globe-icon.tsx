import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgGlobeIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M10 18.544a8.333 8.333 0 1 0 0-16.667 8.333 8.333 0 0 0 0 16.667M1.667 10.21h16.666"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 1.877a12.75 12.75 0 0 1 3.333 8.333A12.75 12.75 0 0 1 10 18.544a12.75 12.75 0 0 1-3.333-8.334A12.75 12.75 0 0 1 10 1.877"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgGlobeIcon);
export default ForwardRef;
