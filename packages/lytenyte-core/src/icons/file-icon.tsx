import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgFileIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8.312 2.21H6.167c-.575 0-1.126.21-1.532.586A1.93 1.93 0 0 0 4 4.21v12c0 .53.228 1.04.635 1.414.406.375.957.586 1.532.586h8.666c.575 0 1.126-.21 1.532-.586.407-.375.635-.884.635-1.414v-6m-8.688-8c1.197 0 2.188.895 2.188 2v2c0 .53.228 1.04.635 1.414.406.375.957.586 1.532.586h2.166c.575 0 1.126.21 1.532.586.407.375.635.884.635 1.414m-8.688-8c3.554 0 8.688 4.764 8.688 8"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgFileIcon);
export default ForwardRef;
