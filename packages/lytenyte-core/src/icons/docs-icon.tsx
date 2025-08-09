import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgDocsIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      width={13.75}
      height={15.5}
      x={2.71}
      y={2.25}
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      rx={2}
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M6.46 6.25h6.25M6.46 10h6.25M6.46 13.75h2.5"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgDocsIcon);
export default ForwardRef;
