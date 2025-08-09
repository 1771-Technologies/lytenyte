import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgDragDotsSmallIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 21"
    ref={ref}
    {...props}
  >
    <circle cx={7.75} cy={5.71} r={1.25} fill="currentcolor" />
    <circle cx={7.75} cy={10.21} r={1.25} fill="currentcolor" />
    <circle cx={7.75} cy={14.71} r={1.25} fill="currentcolor" />
    <circle cx={12.25} cy={5.71} r={1.25} fill="currentcolor" />
    <circle cx={12.25} cy={10.21} r={1.25} fill="currentcolor" />
    <circle cx={12.25} cy={14.71} r={1.25} fill="currentcolor" />
  </svg>
);
const ForwardRef = forwardRef(SvgDragDotsSmallIcon);
export default ForwardRef;
