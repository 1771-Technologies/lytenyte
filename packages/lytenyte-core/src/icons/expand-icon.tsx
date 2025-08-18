import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgExpandIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="m17.71 17.5-5-5m5 5v-4m0 4h-4m-11-4v4m0 0h4m-4 0 5-5m10-6v-4m0 0h-4m4 0-5 5m-10-1v-4m0 0h4m-4 0 5 5"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgExpandIcon);
export default ForwardRef;
