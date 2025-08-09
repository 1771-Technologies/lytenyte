import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgAddIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={21} height={20} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.21 2.5v15M2.71 10h15"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgAddIcon);
export default ForwardRef;
