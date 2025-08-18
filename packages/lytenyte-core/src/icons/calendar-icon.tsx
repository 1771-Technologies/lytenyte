import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgCalendarIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M15.833 3.543H4.167c-.92 0-1.667.746-1.667 1.667v10.666c0 .92.746 1.667 1.667 1.667h11.666c.92 0 1.667-.746 1.667-1.667V5.21c0-.92-.746-1.667-1.667-1.667M13.334 1.877V5.21M6.667 1.877V5.21M2.5 7.543h15"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgCalendarIcon);
export default ForwardRef;
