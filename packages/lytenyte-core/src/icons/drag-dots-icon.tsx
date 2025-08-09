import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgDragDotsIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none" ref={ref} {...props}>
    <circle cx={7.5} cy={5.21} r={1.5} fill="currentcolor" />
    <circle cx={7.5} cy={10.21} r={1.5} fill="currentcolor" />
    <circle cx={7.5} cy={15.21} r={1.5} fill="currentcolor" />
    <circle cx={12.5} cy={5.21} r={1.5} fill="currentcolor" />
    <circle cx={12.5} cy={10.21} r={1.5} fill="currentcolor" />
    <circle cx={12.5} cy={15.21} r={1.5} fill="currentcolor" />
  </svg>
);
const ForwardRef = forwardRef(SvgDragDotsIcon);
export default ForwardRef;
