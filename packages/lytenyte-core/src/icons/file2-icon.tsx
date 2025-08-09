import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgFile2Icon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5.679 6.71V3.37c0-.64.52-1.16 1.16-1.16v0C7.48 2.21 8 2.73 8 3.37v3.34a2.5 2.5 0 0 1-2.5 2.5v0A2.5 2.5 0 0 1 3 6.71V3.483"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.917 2.21H15a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3.953"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgFile2Icon);
export default ForwardRef;
