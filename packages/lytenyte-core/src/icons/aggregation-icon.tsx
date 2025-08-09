import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgAggregationIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m12.651 14.778-2.908 2.904-2.909-2.904"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.743 16.23v-4.593a3 3 0 0 0-1.07-2.296l-2.88-2.423a3 3 0 0 1-1.07-2.296V2.537"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.743 16.23v-4.695a3 3 0 0 1 .942-2.183l2.594-2.445a3 3 0 0 0 .942-2.183V2.537"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgAggregationIcon);
export default ForwardRef;
