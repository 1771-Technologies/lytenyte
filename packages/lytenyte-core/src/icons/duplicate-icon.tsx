import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgDuplicateIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M15.77 6.46H7.98a1.73 1.73 0 0 0-1.73 1.73v7.79c0 .955.775 1.73 1.73 1.73h7.79a1.73 1.73 0 0 0 1.73-1.73V8.19a1.73 1.73 0 0 0-1.73-1.73"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3.03 13.96c-.339-.34-.53-.8-.53-1.282V4.522A1.81 1.81 0 0 1 4.312 2.71h8.156c.481 0 .942.19 1.282.53"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgDuplicateIcon);
export default ForwardRef;
