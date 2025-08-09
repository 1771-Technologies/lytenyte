import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgArrowLeftIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8.043 5.167 3.26 9.95m0 0 4.784 4.784M3.26 9.95h13.482"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgArrowLeftIcon);
export default ForwardRef;
