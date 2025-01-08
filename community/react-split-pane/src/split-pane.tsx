import { clamp, getClientX, getClientY } from "@1771technologies/js-utils";
import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";

export interface SplitPaneAxe {
  readonly ariaLabel?: string;
  readonly ariaDescription: (orientation: "horizontal" | "vertical", rtl: boolean) => string;
}

export interface SplitPaneProps {
  readonly split?: number;
  readonly onSplitChange?: (n: number) => void;

  readonly initialSplit?: number;
  readonly orientation?: "vertical" | "horizontal";

  readonly min?: number;
  readonly max?: number;

  readonly ariaLabelledBy?: string;
  readonly axe: SplitPaneAxe;

  readonly primaryClassName?: string;
  readonly primaryStyle?: CSSProperties;
  readonly secondaryClassName?: string;
  readonly secondaryStyle?: CSSProperties;

  readonly splitterClassName?: string;
  readonly splitterStyle?: CSSProperties;

  readonly rtl?: boolean;

  readonly primary: ReactNode;
  readonly secondary: ReactNode;
}

export function SplitPane({
  initialSplit,
  onSplitChange,
  split,

  orientation = "vertical",

  min = 0,
  max = 100,

  axe,

  rtl = false,

  ariaLabelledBy,
  primaryClassName,
  primaryStyle,
  secondaryClassName,
  secondaryStyle,
  splitterClassName,
  splitterStyle,

  primary,
  secondary,
}: SplitPaneProps) {
  const [internalSplit, setInternalSplit] = useState(split ?? initialSplit ?? 50);

  const userSplit = split ?? internalSplit;

  const clampedSplit = clamp(min, userSplit, max);
  const secondarySplit = 100 - clampedSplit;

  const updateSplit = useCallback(
    (v: number) => {
      onSplitChange?.(v);

      if (!onSplitChange) {
        setInternalSplit(v);
      }
    },
    [onSplitChange],
  );

  const primaryGrow = useMemo(() => {
    return `${clampedSplit}%`;
  }, [clampedSplit]);

  const secondaryGrow = useMemo(() => {
    return `${secondarySplit}%`;
  }, [secondarySplit]);

  const id = useId();
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

        const delta = ((current - start) / (isV ? bb.width : bb.height)) * (rtl ? -1 : 1);

        const final = clamp(min, startPct + delta * 100, max);

        updateSplit(final);
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
        flexDirection: isV ? "row" : "column",
        height: "100%",
        width: "100%",
      }}
    >
      <div
        id={id}
        className={primaryClassName}
        style={{ overflow: "hidden", ...primaryStyle, flexBasis: primaryGrow, minWidth: 0 }}
      >
        {primary}
      </div>
      <div
        role="separator"
        tabIndex={0}
        onKeyDown={(ev) => {
          const increase = isV ? (rtl ? "ArrowLeft" : "ArrowRight") : "ArrowDown";
          const decrease = isV ? (rtl ? "ArrowRight" : "ArrowLeft") : "ArrowUp";

          let next;
          if (ev.key === increase) next = clamp(min, clampedSplit + 5, max);
          if (ev.key === decrease) next = clamp(min, clampedSplit - 5, max);

          if (next == null || next === clampedSplit) return;

          updateSplit(next);
          ev.preventDefault();
          ev.stopPropagation();
        }}
        onPointerDown={handleDrag}
        aria-orientation={orientation}
        aria-valuenow={clampedSplit}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-controls={id}
        aria-label={axe.ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-description={axe.ariaDescription(orientation, rtl)}
        className={splitterClassName}
        style={splitterStyle}
      ></div>

      <div
        className={secondaryClassName}
        style={{ overflow: "hidden", ...secondaryStyle, flexBasis: secondaryGrow, minWidth: 0 }}
      >
        {secondary}
      </div>
    </div>
  );
}
