import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgGridViewIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 21 20"
    ref={ref}
    {...props}
  >
    <rect
      width={15}
      height={15}
      x={2.71}
      y={2.5}
      stroke="currentcolor"
      strokeLinecap="round"
      strokeWidth={1.5}
      rx={3}
    />
    <path stroke="currentcolor" strokeLinecap="round" strokeWidth={1.5} d="M10.21 2.5v15M2.71 10h15" />
  </svg>
);
const ForwardRef = forwardRef(SvgGridViewIcon);
export default ForwardRef;
