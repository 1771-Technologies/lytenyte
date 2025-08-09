import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgExpressionIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="square"
      strokeLinejoin="round"
      strokeWidth={1.42}
      d="M11.55 5.21v5.89M9 6.682l5.1 2.944M9 9.626l5.1-2.945"
    />
    <circle cx={7.778} cy={14.21} r={1.333} fill="currentcolor" />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3.777 4.877A8.85 8.85 0 0 0 2 10.21c0 1.953.63 3.76 1.699 5.227M16.223 4.877A8.85 8.85 0 0 1 18 10.21a8.85 8.85 0 0 1-1.698 5.227"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgExpressionIcon);
export default ForwardRef;
