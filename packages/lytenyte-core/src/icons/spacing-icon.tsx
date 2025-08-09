import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgSpacingIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4 10.21h12M4 3.21v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3M4 17.21v-3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v3"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgSpacingIcon);
export default ForwardRef;
