import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgSearchIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M13.898 14.08a6.812 6.812 0 1 0-9.634-9.633 6.812 6.812 0 0 0 9.634 9.634M14.28 14.462l3.75 3.75"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgSearchIcon);
export default ForwardRef;
