import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgCornerRadiusIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17 4.21h-6a7 7 0 0 0-7 7v6"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgCornerRadiusIcon);
export default ForwardRef;
