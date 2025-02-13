import type { JSX } from "react";

export function DescendingIcon(props: JSX.IntrinsicElements["svg"]) {
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
        d="M5.21619 11.6976L10 16.4814M10 16.4814L14.7838 11.6976M10 16.4814L10 3"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
