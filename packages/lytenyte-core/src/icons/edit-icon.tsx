import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgEditIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 16.877h7.5M13.75 3.126a1.768 1.768 0 1 1 2.5 2.5L5.833 16.043l-3.333.833.833-3.333z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgEditIcon);
export default ForwardRef;
