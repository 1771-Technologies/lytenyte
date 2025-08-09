import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgCustomizeThemeIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M2 16.042c1.6-.776 1.6-2 1.6-2a3.2 3.2 0 1 1 3.2 3.2s-2 .4-4.8-1.2"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7.76 11.002A12.8 12.8 0 0 1 18 2.842a12.8 12.8 0 0 1-8.16 10.24"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.68 7.643a7.2 7.2 0 0 1 3.52 3.52"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgCustomizeThemeIcon);
export default ForwardRef;
