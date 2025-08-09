import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgChevronRightIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m7.5 5.21 5 5-5 5"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgChevronRightIcon);
export default ForwardRef;
