import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgExternalLinkIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15.21 10.833v5a1.666 1.666 0 0 1-1.667 1.667H4.377a1.667 1.667 0 0 1-1.667-1.667V6.667A1.667 1.667 0 0 1 4.377 5h5m3.333-2.5h5m0 0v5m0-5-9.167 9.167"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgExternalLinkIcon);
export default ForwardRef;
