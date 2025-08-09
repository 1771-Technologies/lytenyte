import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgHiddenIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M14.51 4.156c1.924 1.085 3.376 2.843 3.994 4.93a3.96 3.96 0 0 1 0 2.248c-1.043 3.52-4.455 6.102-8.504 6.102a9.2 9.2 0 0 1-4.375-1.097M2.834 13.96a8.2 8.2 0 0 1-1.338-2.626 3.97 3.97 0 0 1 0-2.248C2.538 5.566 5.951 2.984 10 2.984q.483 0 .954.049"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11.475 8.135a2.5 2.5 0 0 1-2.625 4.252M16.25 1.46l-12.5 17.5"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgHiddenIcon);
export default ForwardRef;
