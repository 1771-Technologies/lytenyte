import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgShareIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13.708 6.61a2.16 2.16 0 1 0 0-4.32 2.16 2.16 0 0 0 0 4.32M5.068 12.37a2.16 2.16 0 1 0 0-4.32 2.16 2.16 0 0 0 0 4.32M13.708 18.13a2.16 2.16 0 1 0 0-4.32 2.16 2.16 0 0 0 0 4.32M6.933 11.297l4.766 3.447M11.825 5.751 6.933 9.123"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgShareIcon);
export default ForwardRef;
