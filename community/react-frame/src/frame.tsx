import { Dialog } from "@1771technologies/react-dialog";
import { useCombinedRefs, useEvent } from "@1771technologies/react-utils";
import { useEffect, useState, type CSSProperties, type JSX, type ReactNode } from "react";
import { ResizeDots } from "./resize-dots";
import { getClientX, getClientY } from "@1771technologies/js-utils";

export interface FrameProps {
  readonly show: boolean;
  readonly onShowChange: (b: boolean) => void;
  readonly x: number;
  readonly y: number;
  readonly width?: number | null;
  readonly height?: number | null;

  readonly onSizeChange?: (w: number, h: number) => void;

  readonly initialWidth?: CSSProperties["width"];
  readonly initialHeight?: CSSProperties["height"];

  readonly maxHeight?: CSSProperties["width"];
  readonly maxWidth?: CSSProperties["width"];
  readonly minHeight?: CSSProperties["width"];
  readonly minWidth?: CSSProperties["width"];

  readonly headerHeight?: number;
  readonly header?: ReactNode;
}

export function Frame({
  show,
  onShowChange,
  x,
  y,
  headerHeight = 20,
  header,
  children,

  width,
  height,
  initialWidth,
  initialHeight,
  maxWidth,
  maxHeight,
  minWidth,
  minHeight,

  onSizeChange,

  ...props
}: FrameProps & JSX.IntrinsicElements["dialog"]) {
  const [internalWidth, setInternalWidth] = useState<number | null>(null);
  const [internalHeight, setInternalHeight] = useState<number | null>(null);

  const w = width ?? internalWidth;
  const h = height ?? internalHeight;

  const [ref, setRef] = useState<HTMLElement | null>(null);

  // Ensure the width and height is always respected
  if (ref && w != null && h != null)
    Object.assign(ref.style, { width: `${w}px`, height: `${h}px` });

  const combinedRefs = useCombinedRefs(props.ref, setRef);

  const sizeChange = useEvent(onSizeChange ?? (() => {}));

  useEffect(() => {
    if (!ref) return;

    const bb = ref.getBoundingClientRect();

    sizeChange(bb.width, bb.height);
    setInternalWidth(bb.width);
    setInternalHeight(bb.height);
  }, [ref, sizeChange]);

  return (
    <Dialog
      open={show}
      onOpenChange={onShowChange}
      {...props}
      ref={combinedRefs}
      style={{
        top: y,
        left: x,
        padding: 0,
        margin: 0,
        display: "grid",
        boxSizing: "border-box",
        gridTemplateRows: `${headerHeight}px 1fr 18px`,
        ...props.style,

        width: w ?? initialWidth,
        height: h ?? initialHeight,

        maxWidth: maxWidth,
        maxHeight: maxHeight,
        minWidth: minWidth,
        minHeight: minHeight,
      }}
    >
      <div>{header}</div>
      <div>{children}</div>
      <div style={{ position: "sticky", bottom: 0 }}>
        <button
          onPointerDown={(el) => {
            const startX = getClientX(el.nativeEvent);
            const startY = getClientY(el.nativeEvent);

            const controller = new AbortController();
            window.addEventListener(
              "pointermove",
              (ev) => {
                const currentX = getClientX(ev);
                const currentY = getClientY(ev);
                const xDelta = currentX - startX;
                const yDelta = currentY - startY;

                const maxWidth = window.innerWidth - x;
                const maxHeight = window.innerHeight - y;

                const newWidth = Math.min(w! + xDelta, maxWidth);
                const newHeight = Math.min(h! + yDelta, maxHeight);

                Object.assign(ref!.style, { width: `${newWidth}px`, height: `${newHeight}px` });
              },
              { signal: controller.signal },
            );
            window.addEventListener(
              "pointerup",
              () => {
                const bb = ref!.getBoundingClientRect();

                sizeChange(bb.width, bb.height);
                setInternalWidth(bb.width);
                setInternalHeight(bb.height);

                controller.abort();
              },
              { signal: controller.signal },
            );
          }}
          style={{
            cursor: "pointer",
            width: 16,
            height: 16,
            position: "absolute",
            padding: 0,
            margin: 0,
            border: "none",
            background: "transparent",
            insetInlineEnd: 0,
            top: 2,
          }}
        >
          <ResizeDots />
        </button>
      </div>
    </Dialog>
  );
}
