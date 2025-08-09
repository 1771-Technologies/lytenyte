import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgLocationIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17.5 8.543c0 5.833-7.5 10.833-7.5 10.833s-7.5-5-7.5-10.833a7.5 7.5 0 0 1 15 0"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 11.043a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgLocationIcon);
export default ForwardRef;
