import { clamp } from "@1771technologies/js-utils";
import { useMemo, useState, type PropsWithChildren, type ReactNode } from "react";

export interface SplitPaneProps {
  readonly split?: number;
  readonly onSplitChange?: number;

  readonly initialSplit?: number;
  readonly orientation?: "vertical" | "horizontal";

  readonly mode?: "primary" | "secondary";

  readonly min?: number;
  readonly max?: number;

  readonly primary: ReactNode;
  readonly secondary: ReactNode;
}

export function SplitPane({
  initialSplit,
  split,

  orientation = "vertical",

  min,
  max,

  primary,
  secondary,
}: PropsWithChildren<SplitPaneProps>) {
  const [internalSplit, setInternalSplit] = useState(split ?? initialSplit ?? 50);

  const userSplit = split ?? internalSplit;

  const clampedSplit = clamp(min ?? 0, userSplit, max ?? 100);
  const secondarySplit = 100 - clampedSplit;

  const primaryGrow = useMemo(() => {
    return `${clampedSplit}%`;
  }, [clampedSplit]);

  const secondaryGrow = useMemo(() => {
    return `${secondarySplit}%`;
  }, [secondarySplit]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: orientation === "horizontal" ? "column" : "row",
        height: "100%",
        width: "100%",
      }}
    >
      <div style={{ flexBasis: primaryGrow, minWidth: 0, overflow: "hidden" }}>{primary}</div>
      {orientation === "horizontal" && (
        <div style={{ width: "100%", height: "3px", background: "blue" }}></div>
      )}
      {orientation === "vertical" && (
        <div style={{ width: "3px", height: "100%", background: "blue" }}></div>
      )}

      <div style={{ flexBasis: secondaryGrow, minWidth: 0, overflow: "hidden" }}>{secondary}</div>
    </div>
  );
}
