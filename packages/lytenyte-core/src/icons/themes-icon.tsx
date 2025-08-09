import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgThemesIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M16.223 2.21h-3.556a1.78 1.78 0 0 0-1.778 1.778v10.666a3.556 3.556 0 1 0 7.111 0V3.988a1.78 1.78 0 0 0-1.777-1.778"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.889 6.077 9.11 4.299a1.78 1.78 0 0 0-2.514 0L4.083 6.813a1.78 1.78 0 0 0 0 2.513l8 8"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5.822 11.099H3.778A1.78 1.78 0 0 0 2 12.876v3.556a1.78 1.78 0 0 0 1.778 1.778h10.666m0-3.556v.01"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgThemesIcon);
export default ForwardRef;
