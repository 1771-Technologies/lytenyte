import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgAutosizeIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M14.355 3.21h.978c.92 0 1.667.746 1.667 1.667v10.666c0 .92-.746 1.667-1.667 1.667h-.963m-8.751-14h-.952C3.747 3.21 3 3.956 3 4.877v10.666c0 .92.746 1.667 1.667 1.667h.95M16.25 9.96H3.75"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12.051 15.148 9.987 17.21l-2.065-2.06M9.986 12.834v4.375M7.922 5.272l2.064-2.06 2.065 2.06M9.986 3.21v4.376"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgAutosizeIcon);
export default ForwardRef;
