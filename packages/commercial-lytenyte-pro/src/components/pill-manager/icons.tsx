import type { JSX } from "react";

export function Icon(props: JSX.IntrinsicElements["div"]) {
  return (
    <div
      {...props}
      style={{
        height: 20,
        width: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...props.style,
      }}
    />
  );
}

type Props = JSX.IntrinsicElements["svg"];
export const DragDots = (props: Props) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="currentcolor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="7.75" cy="5.5" r="1.25" />
      <circle cx="7.75" cy="10" r="1.25" />
      <circle cx="7.75" cy="14.5" r="1.25" />
      <circle cx="12.25" cy="5.5" r="1.25" />
      <circle cx="12.25" cy="10" r="1.25" />
      <circle cx="12.25" cy="14.5" r="1.25" />
    </svg>
  );
};

export const Measure = (props: Props) => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M15 6.25V4H5L10.7143 10L5 16H15V13.75"
        stroke="currentcolor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const RowGroups = (props: Props) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      stroke="currentcolor"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 9.8252L14.8284 9.8252L14.8284 6.99677"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.8286 12.6543L14.8286 9.82587L17.657 9.82587"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="2"
        y="2"
        width="8"
        height="16"
        rx="2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M2 6H10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 10H10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 14H10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const Columns = (props: Props) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      stroke="currentcolor"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="2.5" y="2.5" width="15" height="15" rx="3" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 2.5V17.5" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2.5 7L17.5 7" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

export const RowPivots = (props: Props) => {
  return (
    <svg
      width="16"
      height="16"
      stroke="currentcolor"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M2.5 3.75H17.203" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 9.56055H9.07178" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 15.4688H9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M12 12.8281L14.8284 12.8281L14.8284 9.9997"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.8286 15.6572L14.8286 12.8288L17.657 12.8288"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ColumnPivots = (props: Props) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      stroke="currentcolor"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M4.125 17.2822L4.125 2.57926" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M9.93604 17.2822L9.93603 10.7104"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.8438 17.2822L15.8437 10.7822"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.2036 7.78223L13.2036 4.9538L10.3752 4.9538"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.0317 4.95312L13.2033 4.95313L13.2033 2.1247"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ExpandIcon = (props: Props) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      stroke="currentcolor"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.84325 17.0415L2.9488 17.038L2.94531 13.1436"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.02344 11.9639L2.94924 17.0381"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.1577 2.93409L17.0522 2.93758L17.0557 6.83203"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.0518 2.93555L11.9776 8.00974"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const CollapseIcon = (props: Props) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      stroke="currentcolor"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15.8198 8.07763L11.9254 8.07414L11.9219 4.17969"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M17 3L11.9258 8.0742" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M4.51124 11.5786L8.40569 11.5821L8.40918 15.4766"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.40527 11.5801L3.33107 16.6543"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
