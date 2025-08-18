import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgPinColumnIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="m3 17.21 4.355-4.355m0 0 3.446 3.446a.87.87 0 0 0 1.417-.274l1.964-4.583a.87.87 0 0 1 .477-.466l2.794-1.117a.87.87 0 0 0 .292-1.424l-5.972-5.972a.87.87 0 0 0-1.424.292L9.232 5.551a.87.87 0 0 1-.466.477L4.183 7.992a.87.87 0 0 0-.274 1.417z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgPinColumnIcon);
export default ForwardRef;
