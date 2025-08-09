import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgDownloadIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={21} height={20} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M2.71 13.97v1.765c0 .468.198.917.55 1.248.35.331.828.517 1.325.517h11.25c.497 0 .974-.186 1.326-.517.351-.33.549-.78.549-1.248v-1.764M5.522 8.676l4.688 4.412m0 0 4.688-4.412m-4.688 4.412V2.5"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgDownloadIcon);
export default ForwardRef;
