import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgSort2Icon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 21"
    ref={ref}
    {...props}
  >
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M2.25 4.21h15m-12.6 6h10.2m-6.6 6h3"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgSort2Icon);
export default ForwardRef;
