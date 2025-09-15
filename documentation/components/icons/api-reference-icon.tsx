import { JSX } from "react";

export function ApiReferenceIcon(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_562_655708)">
        <path
          d="M16.42 3.58022C14.4447 1.60491 11.7286 2.83948 10.9879 3.58022L9.50639 5.0617L14.9385 10.4938L16.42 9.01232C17.1607 8.27158 18.3953 5.55553 16.42 3.58022ZM16.42 3.58022L18.8891 1.11108M3.58046 16.4197C5.55577 18.395 8.27182 17.1605 9.01256 16.4197L10.494 14.9382L5.06195 9.50615L3.58046 10.9876C2.83972 11.7284 1.60516 14.4444 3.58046 16.4197ZM3.58046 16.4197L1.11133 18.8889M9.50639 13.9506L11.4817 11.9753M6.0496 10.4938L8.02491 8.51849"
          stroke="currentcolor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_562_655708">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
