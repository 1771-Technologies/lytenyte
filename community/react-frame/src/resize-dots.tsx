import type { JSX } from "react";

export const ResizeDots = (props: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="5" cy="9" r="1" fill="currentcolor" />
      <circle cx="9" cy="9" r="1" fill="currentcolor" />
      <circle cx="5" cy="5" r="1" fill="currentcolor" />
      <circle cx="9" cy="5" r="1" fill="currentcolor" />
      <circle cx="9" cy="1" r="1" fill="currentcolor" />
      <circle cx="1" cy="9" r="1" fill="currentcolor" />
    </svg>
  );
};
