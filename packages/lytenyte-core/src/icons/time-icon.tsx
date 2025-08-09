import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgTimeIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 21 20"
    ref={ref}
    {...props}
  >
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.21 18.334a8.333 8.333 0 1 0 0-16.667 8.333 8.333 0 1 0 0 16.667"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.213 5v5.004l3.533 3.534"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgTimeIcon);
export default ForwardRef;
