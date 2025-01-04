import { Dialog } from "@1771technologies/react-dialog";
import { useCombinedRefs, useEvent } from "@1771technologies/react-utils";
import { useEffect, useRef, useState, type CSSProperties, type JSX, type ReactNode } from "react";
import { ResizeDots } from "./resize-dots";
import { handleResize } from "./handle-resize";
import { handleMove } from "./handle-move";
import { handleSizeBounds } from "./handle-size-bounds";

export interface FrameProps {
  readonly show: boolean;
  readonly onShowChange: (b: boolean) => void;
  readonly x: number;
  readonly y: number;
  readonly width?: number | null;
  readonly height?: number | null;

  readonly onSizeChange?: (w: number, h: number) => void;
  readonly onMove?: (x: number, y: number) => void;

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
  onMove,

  ...props
}: FrameProps & JSX.IntrinsicElements["dialog"]) {
  const [internalWidth, setInternalWidth] = useState<number | null>(null);
  const [internalHeight, setInternalHeight] = useState<number | null>(null);

  const w = width ?? internalWidth;
  const h = height ?? internalHeight;

  const [ref, setRef] = useState<HTMLElement | null>(null);

  const sizeRef = useRef({ w, h, x, y });
  sizeRef.current = { w, h, x, y };

  const sizeSync = useEvent(() => {
    if (!ref) return;

    const s = sizeRef.current;
    const adjusted = handleSizeBounds(s.x, s.y, s.w!, s.h!);

    Object.assign(ref.style, {
      width: `${adjusted.w}px`,
      height: `${adjusted.h}px`,
      top: `${adjusted.y}px`,
      left: `${adjusted.x}px`,
    });
  });

  const combinedRefs = useCombinedRefs(props.ref, setRef);

  const sizeChange = useEvent(onSizeChange ?? (() => {}));

  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener(
      "resize",
      () => {
        console.log("i ran");
        sizeSync();
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [sizeSync]);

  useEffect(() => {
    if (!ref) return;

    const bb = ref.getBoundingClientRect();

    sizeChange(bb.width, bb.height);
    setInternalWidth(bb.width);
    setInternalHeight(bb.height);

    setTimeout(sizeSync);
  }, [ref, sizeChange, sizeSync]);

  const raf = useRef<number | null>(null);
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
      <div
        onPointerDown={(el) => {
          handleMove(el.nativeEvent, ref!, raf, onMove ?? (() => {}), w!, h!, sizeSync);

          setTimeout(sizeSync);
        }}
      >
        {header}
      </div>
      <div>{children}</div>
      <div style={{ position: "sticky", bottom: 0 }}>
        <button
          onPointerDown={(el) => {
            if (raf.current) cancelAnimationFrame(raf.current);
            raf.current = requestAnimationFrame(() => {
              handleResize(
                el.nativeEvent,
                x,
                y,
                w!,
                h!,
                ref!,
                (w, h) => {
                  sizeChange(w, h);
                  setInternalHeight(h);
                  setInternalWidth(w);
                },
                sizeSync,
              );

              raf.current = null;
            });
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
