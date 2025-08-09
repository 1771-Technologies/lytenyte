import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgFilterIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17.212 3.96H2.908c-.218 0-.408.177-.408.38v1.673c0 .152.054.33.163.456l4.973 6.11a.85.85 0 0 1 .217.557v4.537c0 .152.163.254.3.178l3.396-1.217c.353-.152.57-.456.57-.811v-2.687a.85.85 0 0 1 .218-.558l5-6.109a.68.68 0 0 0 .163-.456V3.96"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgFilterIcon);
export default ForwardRef;
