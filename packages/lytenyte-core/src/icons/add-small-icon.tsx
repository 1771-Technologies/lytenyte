import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgAddSmallIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={21} height={20} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.21 4.883v10.233M5.093 10h10.234"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgAddSmallIcon);
export default ForwardRef;
