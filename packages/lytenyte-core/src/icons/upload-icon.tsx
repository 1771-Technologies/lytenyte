import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgUploadIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 21 20"
    ref={ref}
    {...props}
  >
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M2.71 13.97v1.765c0 .468.198.917.55 1.248.35.331.828.517 1.325.517h11.25c.497 0 .974-.186 1.326-.517.351-.33.549-.78.549-1.248v-1.764M5.522 6.911 10.21 2.5m0 0 4.688 4.411M10.21 2.5v10.588"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgUploadIcon);
export default ForwardRef;
