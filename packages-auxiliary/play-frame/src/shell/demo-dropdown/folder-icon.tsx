import type { JSX } from "react";

export const FolderIcon = (props: JSX.IntrinsicElements["svg"]) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    fill="currentcolor"
    viewBox="0 0 256 256"
    {...props}
  >
    <path d="M216 72h-84.69L104 44.69A15.86 15.86 0 0 0 92.69 40H40a16 16 0 0 0-16 16v144.62A15.4 15.4 0 0 0 39.38 216h177.51A15.13 15.13 0 0 0 232 200.89V88a16 16 0 0 0-16-16ZM40 56h52.69l16 16H40Zm176 144H40V88h176Z" />
  </svg>
);
