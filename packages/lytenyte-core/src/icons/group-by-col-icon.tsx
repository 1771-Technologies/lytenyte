import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgGroupByColIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 10.035h2.828V7.207M14.829 12.864v-2.828h2.828"
    />
    <rect
      width={8}
      height={16}
      x={2}
      y={2.21}
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      rx={2}
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M2 6.21h8M2 10.21h8M2 14.21h8"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgGroupByColIcon);
export default ForwardRef;
