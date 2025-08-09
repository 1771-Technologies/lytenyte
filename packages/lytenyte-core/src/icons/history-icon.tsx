import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgHistoryIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M10 6.495v3.715l2.322 2.321"
    />
    <path
      fill="currentcolor"
      d="m2.885 5.447-.697.003a.696.696 0 0 0 .693.694zm2.36.708a.697.697 0 1 0 .007-1.393zM3.57 3.079a.696.696 0 1 0-1.393.008zM2.34 10.21a.696.696 0 1 0-1.393 0zm12.188 7.842a.697.697 0 1 0-.696-1.205zm2.11-4.011a.696.696 0 1 0 1.205.696zM3.63 3.775a.697.697 0 0 0 .98.99zm12.742.062C12.825.29 7.092.254 3.568 3.778l.985.984c2.971-2.97 7.821-2.953 10.835.06zM3.568 3.778 2.393 4.954l.984.984 1.177-1.174zm-.687 2.366 2.364.01.007-1.392-2.363-.011zm.7-.7L3.57 3.078l-1.393.008.012 2.363zM10 2.548a7.66 7.66 0 0 1 7.661 7.661h1.393A9.054 9.054 0 0 0 10 1.156zm0 15.322a7.66 7.66 0 0 1-7.661-7.66H.946A9.054 9.054 0 0 0 10 19.263zm3.83-1.024A7.6 7.6 0 0 1 10 17.871v1.393a9 9 0 0 0 4.527-1.212zm3.831-6.637a7.6 7.6 0 0 1-1.024 3.83l1.205.697a9 9 0 0 0 1.212-4.527zM4.611 4.765A7.63 7.63 0 0 1 10 2.549V1.156a9.03 9.03 0 0 0-6.37 2.619z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgHistoryIcon);
export default ForwardRef;
