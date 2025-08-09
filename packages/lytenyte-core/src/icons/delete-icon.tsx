import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgDeleteIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 5.21h14M15 5.41v11.2c0 .424-.15.831-.418 1.131s-.632.469-1.01.469H6.428c-.38 0-.743-.169-1.01-.469A1.7 1.7 0 0 1 5 16.61V5.41m2.143-1v-.6c0-.424.15-.831.418-1.131s.632-.469 1.01-.469h2.858c.378 0 .742.169 1.01.469s.418.707.418 1.131v.6"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgDeleteIcon);
export default ForwardRef;
