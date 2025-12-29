import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgListViewIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 21 20"
    ref={ref}
    {...props}
  >
    <circle cx={4.335} cy={6.875} r={1.875} stroke="currentcolor" strokeWidth={1.5} />
    <circle cx={4.335} cy={14.375} r={1.875} stroke="currentcolor" strokeWidth={1.5} />
    <path stroke="currentcolor" strokeLinecap="round" strokeWidth={1.5} d="M9.96 6.875h4.25M9.96 14.375h8" />
  </svg>
);
const ForwardRef = forwardRef(SvgListViewIcon);
export default ForwardRef;
