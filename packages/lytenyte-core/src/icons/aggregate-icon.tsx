import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgAggregateIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={21} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m15.065 6.303-.024-2.25-9.999.105 5.777 5.94-5.65 6.06 9.999-.106-.024-2.25"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgAggregateIcon);
export default ForwardRef;
