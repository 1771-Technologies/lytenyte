import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgCollapseGroupIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m15.82 8.288-3.894-.004-.004-3.894M17 3.21l-5.074 5.074M4.512 11.789l3.894.003.004 3.895M8.406 11.79l-5.074 5.074"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgCollapseGroupIcon);
export default ForwardRef;
