import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgLinkIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="m11.5 14.71-1.5 1.5a4.243 4.243 0 0 1-6 0v0a4.243 4.243 0 0 1 0-6l1.5-1.5M14.5 11.71l1.5-1.5a4.243 4.243 0 0 0 0-6v0a4.243 4.243 0 0 0-6 0l-1.5 1.5M7.5 12.71l5-5"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgLinkIcon);
export default ForwardRef;
