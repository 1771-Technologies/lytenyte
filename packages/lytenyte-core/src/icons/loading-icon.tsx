import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgLoadingIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 1.877V5.21M10 15.21v3.333M4.108 4.318l2.359 2.359M13.533 13.743l2.359 2.359M1.667 10.21H5M15 10.21h3.333M4.108 16.102l2.359-2.359M13.533 6.677l2.359-2.359"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgLoadingIcon);
export default ForwardRef;
