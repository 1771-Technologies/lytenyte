import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgTaskIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15.833 3.543H4.167c-.92 0-1.667.746-1.667 1.667v10.666c0 .92.746 1.667 1.667 1.667h11.666c.92 0 1.667-.746 1.667-1.667V5.21c0-.92-.746-1.667-1.667-1.667"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m7.5 10.38 1.895 1.83L13 8.71M13.334 1.877V5.21M6.667 1.877V5.21"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgTaskIcon);
export default ForwardRef;
