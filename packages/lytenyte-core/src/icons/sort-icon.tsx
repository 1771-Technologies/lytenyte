import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgSortIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M2.5 3.96h14.703M2.5 9.77h6.572M2.5 15.679h4.072M14.43 9.287v6.592M11.361 13.462l3.07 2.998 3.069-2.998"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgSortIcon);
export default ForwardRef;
