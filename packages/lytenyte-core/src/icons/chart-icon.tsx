import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgChartIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M17 13.432a7.8 7.8 0 0 1-2.263 3.022 7.8 7.8 0 0 1-7.177 1.424 7.8 7.8 0 0 1-3.241-1.929 7.83 7.83 0 0 1-2.187-6.998 7.84 7.84 0 0 1 1.564-3.438 7.8 7.8 0 0 1 2.99-2.303"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M18 10.21a8 8 0 0 0-8-8v8z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgChartIcon);
export default ForwardRef;
