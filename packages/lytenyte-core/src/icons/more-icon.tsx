import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgMoreIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 21 20"
    ref={ref}
    {...props}
  >
    <path
      fill="currentcolor"
      fillRule="evenodd"
      d="M5.71 9.75a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0m6 0a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0m4.25 1.75a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5"
      clipRule="evenodd"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgMoreIcon);
export default ForwardRef;
