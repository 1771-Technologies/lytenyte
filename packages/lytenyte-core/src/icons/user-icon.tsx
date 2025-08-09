import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgUserIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16.667 17.71v-1.667a3.333 3.333 0 0 0-3.334-3.333H6.668a3.333 3.333 0 0 0-3.333 3.333v1.667M10 9.377a3.333 3.333 0 1 0 0-6.667 3.333 3.333 0 0 0 0 6.667"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgUserIcon);
export default ForwardRef;
