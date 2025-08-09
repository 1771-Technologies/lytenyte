import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgChevronLeftIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    ref={ref}
    {...props}
  >
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m12.5 5-5 5 5 5"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgChevronLeftIcon);
export default ForwardRef;
