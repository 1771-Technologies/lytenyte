import type { ColumnPin } from "../+types";

export function ResizeHandle({ pin }: { pin: ColumnPin }) {
  return (
    <div
      style={{
        width: "20px",
        height: "100%",
        background: "red",
        position: "absolute",
        top: 0,
        insetInlineStart: pin === "end" ? "0px" : undefined,
        insetInlineEnd: pin === "end" ? undefined : "0px",
      }}
    />
  );
}
