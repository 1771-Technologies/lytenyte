import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgEmailIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <rect
      width={16}
      height={12.661}
      x={2}
      y={4.21}
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      rx={3}
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m15.507 7.036-3.72 2.777a3 3 0 0 1-3.594-.003l-3.7-2.774"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgEmailIcon);
export default ForwardRef;
