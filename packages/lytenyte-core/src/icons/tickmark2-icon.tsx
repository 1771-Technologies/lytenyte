import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgTickmark2Icon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 18.544a8.333 8.333 0 1 0 0-16.667 8.333 8.333 0 0 0 0 16.667"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m7 9.857 2.24 2.353 4.26-4.5"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgTickmark2Icon);
export default ForwardRef;
