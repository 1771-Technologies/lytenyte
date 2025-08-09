import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgArrowDownIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M5.216 11.907 10 16.691m0 0 4.784-4.784M10 16.691V3.209"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgArrowDownIcon);
export default ForwardRef;
