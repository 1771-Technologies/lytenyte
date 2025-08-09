import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgTickmarkIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m3 10.769 4.64 4.941 9.86-10.5"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgTickmarkIcon);
export default ForwardRef;
