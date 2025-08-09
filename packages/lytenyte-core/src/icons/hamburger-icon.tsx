import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgHamburgerIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M2.25 4.21h15m-15 6h15m-15 6h15"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgHamburgerIcon);
export default ForwardRef;
