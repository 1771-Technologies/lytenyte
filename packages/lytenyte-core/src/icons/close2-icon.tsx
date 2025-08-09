import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgClose2Icon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 21"
    ref={ref}
    {...props}
  >
    <circle
      cx={10}
      cy={10.21}
      r={8}
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m7.171 7.382 5.657 5.657M7.171 13.038l5.657-5.657"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgClose2Icon);
export default ForwardRef;
