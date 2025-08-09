import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgHelpIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 18.544a8.333 8.333 0 1 0 0-16.667 8.333 8.333 0 1 0 0 16.667"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7.559 7.958a2.645 2.645 0 0 1 5.14.882c0 1.763-2.645 2.645-2.645 2.645M10.125 15.012h.009"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgHelpIcon);
export default ForwardRef;
