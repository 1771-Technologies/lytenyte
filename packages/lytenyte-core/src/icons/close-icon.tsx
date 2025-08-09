import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgCloseIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m4.697 4.906 10.606 10.607M4.697 15.514 15.303 4.907"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgCloseIcon);
export default ForwardRef;
