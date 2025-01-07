import { clamp, getClientX, getClientY } from "@1771technologies/js-utils";
import {
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type PropsWithChildren,
  type ReactNode,
} from "react";

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

  const ref = useRef<HTMLDivElement | null>(null);
  const isV = orientation === "vertical";
  const handleDrag = (ev: PointerEvent) => {
    const container = ref.current!;
    const bb = container.getBoundingClientRect();
    const start = isV ? getClientX(ev.nativeEvent) - bb.left : getClientY(ev.nativeEvent) - bb.top;
    const startPct = clampedSplit;

    const controller = new AbortController();

    document.addEventListener(
      "pointermove",
      (e) => {
        const bb = container.getBoundingClientRect();
        const current = isV ? getClientX(e) - bb.left : getClientY(e) - bb.top;

        const delta = (current - start) / (isV ? bb.width : bb.height);

        const final = clamp(min ?? 0, startPct + delta * 100, max ?? 100);

        setInternalSplit(final);
      },
      { signal: controller.signal },
    );

    globalThis.addEventListener(
      "pointerup",
      () => {
        controller.abort();
      },
      { signal: controller.signal },
    );
  };

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: orientation === "horizontal" ? "column" : "row",
        height: "100%",
        width: "100%",
      }}
    >
      <div style={{ flexBasis: primaryGrow, minWidth: 0, overflow: "hidden" }}>{primary}</div>
      {orientation === "horizontal" && (
        <div
          onPointerDown={handleDrag}
          style={{ width: "100%", height: "3px", background: "blue", cursor: "row-resize" }}
        ></div>
      )}
      {orientation === "vertical" && (
        <div
          onPointerDown={handleDrag}
          style={{ width: "3px", height: "100%", background: "blue", cursor: "col-resize" }}
        ></div>
      )}

      <div style={{ flexBasis: secondaryGrow, minWidth: 0, overflow: "hidden" }}>{secondary}</div>
    </div>
  );
}
