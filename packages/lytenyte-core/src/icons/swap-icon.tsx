import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgSwapIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M7 16.21v-12L3 7.755M13 4.21v12l4-3.546"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgSwapIcon);
export default ForwardRef;
