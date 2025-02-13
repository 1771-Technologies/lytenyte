import type { JSX } from "react";

export function TickIcon(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3 10.5588L7.64 15.5L17.5 5"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
