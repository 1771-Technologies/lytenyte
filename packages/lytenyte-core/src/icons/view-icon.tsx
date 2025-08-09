import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgViewIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 21"
    ref={ref}
    {...props}
  >
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M1.496 11.334a3.97 3.97 0 0 1 0-2.248C2.538 5.566 5.951 2.984 10 2.984s7.462 2.582 8.504 6.102a3.96 3.96 0 0 1 0 2.248c-1.043 3.52-4.455 6.102-8.504 6.102s-7.462-2.582-8.504-6.102"
    />
    <circle
      cx={10.081}
      cy={10.21}
      r={2.5}
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
);
const ForwardRef = forwardRef(SvgViewIcon);
export default ForwardRef;
