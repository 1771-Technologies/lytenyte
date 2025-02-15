import type { JSX } from "react";

export function DownloadIcon(props: JSX.IntrinsicElements["svg"]) {
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
        d="M2.5 13.9706V15.7353C2.5 16.2033 2.69754 16.6522 3.04917 16.9831C3.40081 17.3141 3.87772 17.5 4.375 17.5H15.625C16.1223 17.5 16.5992 17.3141 16.9508 16.9831C17.3025 16.6522 17.5 16.2033 17.5 15.7353V13.9706M5.3125 8.67647L10 13.0882M10 13.0882L14.6875 8.67647M10 13.0882V2.5"
        stroke="#5C6170"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
