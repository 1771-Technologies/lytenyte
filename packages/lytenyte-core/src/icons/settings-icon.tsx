import type { SVGProps, Ref } from "react";
import { forwardRef } from "react";
const SvgSettingsIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M10 12.21a2 2 0 1 0 0-4 2 2 0 0 0 0 4"
    />
    <path
      stroke="currentcolor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15.382 12.392a1.2 1.2 0 0 0 .24 1.323l.043.044a1.455 1.455 0 1 1-2.058 2.058l-.043-.043a1.2 1.2 0 0 0-1.324-.24 1.2 1.2 0 0 0-.727 1.098v.123a1.454 1.454 0 1 1-2.91 0v-.065a1.2 1.2 0 0 0-.785-1.098 1.2 1.2 0 0 0-1.323.24l-.044.043a1.454 1.454 0 0 1-2.374-.472 1.45 1.45 0 0 1 .316-1.586l.043-.043a1.2 1.2 0 0 0 .24-1.324 1.2 1.2 0 0 0-1.098-.727h-.123a1.455 1.455 0 0 1 0-2.91h.065a1.2 1.2 0 0 0 1.098-.785 1.2 1.2 0 0 0-.24-1.323l-.043-.044a1.455 1.455 0 1 1 2.058-2.058l.043.043a1.2 1.2 0 0 0 1.324.24h.058a1.2 1.2 0 0 0 .727-1.098v-.123a1.455 1.455 0 0 1 2.91 0v.065a1.2 1.2 0 0 0 .727 1.098 1.2 1.2 0 0 0 1.323-.24l.044-.043a1.455 1.455 0 1 1 2.058 2.058l-.043.043a1.2 1.2 0 0 0-.24 1.324v.058a1.2 1.2 0 0 0 1.098.727h.123a1.455 1.455 0 0 1 0 2.91h-.065a1.2 1.2 0 0 0-1.098.727"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgSettingsIcon);
export default ForwardRef;
