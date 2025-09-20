import type { JSX } from "react";

export function CodeSandboxIcon(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_2558_103405)">
        <path
          d="M2 4.40005L8.2721 0.800049L14.5465 4.40005L14.6005 11.5694L8.2721 15.2L2 11.6V4.40005ZM3.2537 5.8882V8.743L5.2598 9.85855V11.9681L7.64345 13.3465V8.38255L3.2537 5.8882ZM13.2968 5.8882L8.90705 8.3821V13.346L11.2885 11.9677V9.8608L13.2972 8.743L13.2968 5.8882ZM3.87965 4.76095L8.26265 7.24765L12.6547 4.7398L10.3322 3.4204L8.28605 4.5877L6.2282 3.40645L3.87965 4.76095Z"
          fill="currentcolor"
        />
      </g>
      <defs>
        <clipPath id="clip0_2558_103405">
          <rect width="14.4" height="14.4" fill="white" transform="translate(0.799805 0.800049)" />
        </clipPath>
      </defs>
    </svg>
  );
}
