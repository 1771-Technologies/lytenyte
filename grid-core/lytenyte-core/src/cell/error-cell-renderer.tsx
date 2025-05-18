import type { ApiPro } from "@1771technologies/grid-types/pro";

export function ErrorCellRenderer({ api }: { api: ApiPro<any, any> }) {
  return (
    <button
      style={{
        color: "red",
        display: "flex",
        alignItems: "center",
        padding: 4,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        border: "none",
        backgroundColor: "transparent",
        gap: 4,
      }}
      onClick={() => {
        api.rowReload();
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        width={20}
        height={20}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
        />
      </svg>
      Retry
    </button>
  );
}
