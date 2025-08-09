import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgSpacingHIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M10 16.21v-12M3 16.21h3a1 1 0 0 0 1-1v-10a1 1 0 0 0-1-1H3M17 16.21h-3a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1h3"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgSpacingHIcon);
export default ForwardRef;
