import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgPieIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M17.485 13.654a8.37 8.37 0 0 1-2.42 3.232 8.34 8.34 0 0 1-7.674 1.523 8.35 8.35 0 0 1-3.466-2.063 8.37 8.37 0 0 1-2.338-7.483A8.4 8.4 0 0 1 3.26 5.187a8.35 8.35 0 0 1 3.196-2.462"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M18.554 10.21A8.554 8.554 0 0 0 10 1.655v8.555z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgPieIcon);
export default ForwardRef;
