import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgArrowRightCurvedIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m12.5 11.876 4.167-4.166L12.5 3.543"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3.334 16.877v-5.834A3.333 3.333 0 0 1 6.667 7.71h10"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgArrowRightCurvedIcon);
export default ForwardRef;
