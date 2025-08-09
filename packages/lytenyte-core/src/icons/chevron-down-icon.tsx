import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgChevronDownIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="m5 7.71 5 5 5-5"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgChevronDownIcon);
export default ForwardRef;
