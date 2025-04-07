import type { JSX } from "react";

export function FunnelIcon(props: JSX.IntrinsicElements["svg"]) {
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
        d="M17.212 3.75H2.90761C2.69022 3.75 2.5 3.92744 2.5 4.13022V5.8032C2.5 5.95529 2.55435 6.13273 2.66304 6.25947L7.63587 12.3684C7.77174 12.5205 7.85326 12.7233 7.85326 12.926V17.4634C7.85326 17.6155 8.0163 17.7168 8.15217 17.6408L11.5489 16.4241C11.9022 16.272 12.1196 15.9678 12.1196 15.613V12.926C12.1196 12.7233 12.2011 12.5205 12.337 12.3684L17.337 6.25947C17.4457 6.13273 17.5 5.98064 17.5 5.8032V3.75"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
