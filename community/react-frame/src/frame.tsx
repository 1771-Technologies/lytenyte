import { Dialog } from "@1771technologies/react-dialog";
import { refCompat, useCombinedRefs, useEvent } from "@1771technologies/react-utils";
import { useEffect, useRef, useState, type CSSProperties, type JSX, type ReactNode } from "react";
import { ResizeDots } from "./resize-dots.js";
import { handleResize } from "./handle-resize.js";
import { handleMove } from "./handle-move.js";
import { handleSizeBounds } from "./handle-size-bounds.js";
import { srOnlyStyle } from "@1771technologies/js-utils";

/**
 * Interface for accessibility props related to frame resizing and moving operations
 */
export interface FrameAxeProps {
  /** Aria label for the resize handle */
  readonly axeResizeLabel: string;
  /** Detailed description of resize functionality for screen readers */
  readonly axeResizeDescription: string;
  /** Function to generate screen reader text when resize starts */
  readonly axeResizeStartText: (w: number, h: number) => string;
  /** Function to generate screen reader text when resize ends */
  readonly axeResizeEndText: (w: number, h: number) => string;

  /** Aria label for the move handle */
  readonly axeMoveLabel: string;
  /** Detailed description of move functionality for screen readers */
  readonly axeMoveDescription: string;
  /** Function to generate screen reader text when move starts */
  readonly axeMoveStartText: (x: number, y: number) => string;
  /** Function to generate screen reader text when move ends */
  readonly axeMoveEndText: (x: number, y: number) => string;
}

/**
 * Props interface for the Frame component
 */
export interface FrameProps {
  /** Controls visibility of the frame */
  readonly show: boolean;
  /** Callback fired when visibility changes */
  readonly onShowChange: (b: boolean) => void;
  /** Horizontal position of the frame */
  readonly x: number;
  /** Vertical position of the frame */
  readonly y: number;
  /** Current width of the frame. If null, uses internal state */
  readonly width?: number | null;
  /** Current height of the frame. If null, uses internal state */
  readonly height?: number | null;

  /** Whether the frame can be moved by dragging. Defaults to true */
  readonly movable?: boolean;
  /** Whether the frame can be resized. Defaults to true */
  readonly resizable?: boolean;

  /** Callback fired when frame is resized */
  readonly onSizeChange?: (w: number, h: number) => void;
  /** Callback fired when frame is moved */
  readonly onMove?: (x: number, y: number) => void;

  /** Initial width of the frame */
  readonly initialWidth?: CSSProperties["width"];
  /** Initial height of the frame */
  readonly initialHeight?: CSSProperties["height"];

  /** Maximum allowed height */
  readonly maxHeight?: CSSProperties["width"];
  /** Maximum allowed width */
  readonly maxWidth?: CSSProperties["width"];
  /** Minimum allowed height */
  readonly minHeight?: CSSProperties["width"];
  /** Minimum allowed width */
  readonly minWidth?: CSSProperties["width"];

  /** Content to render in the frame header */
  readonly header?: ReactNode;

  /** Accessibility props for resize and move operations */
  readonly axe: FrameAxeProps;

  readonly headerClassName?: string;
  readonly headerStyle?: CSSProperties;
  readonly contentClassName?: string;
  readonly contentStyle?: CSSProperties;
}

function FrameImpl({
  show,
  onShowChange,
  x,
  y,
  header,
  children,

  movable = true,
  resizable = true,

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
  axe,

  headerClassName,
  headerStyle,

  contentClassName,
  contentStyle,

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
    /* v8 ignore next 1 */ // line is covered, but not directly
    if (!ref) return;

    const s = sizeRef.current;
    const adjusted = handleSizeBounds(s.x, s.y, s.w!, s.h!);

    Object.assign(ref!.style, {
      width: `${adjusted.w}px`,
      height: `${adjusted.h}px`,
      top: `${adjusted.y}px`,
      left: `${adjusted.x}px`,
    });
  });

  const combinedRefs = useCombinedRefs(props.ref, setRef);

  const sizeChange = useEvent((w: number, h: number) => {
    /* v8 ignore next 1 */ // line is covered, but not directly
    onSizeChange?.(w, h);
    setInternalHeight(h);
    setInternalWidth(w);
  });

  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener(
      "resize",
      () => {
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

    setTimeout(sizeSync);
  }, [ref, sizeChange, sizeSync]);

  const [resizeAnnouncer, setResizeAnnouncer] = useState<HTMLDivElement | null>(null);

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
        display: "flex",
        flexDirection: "column",

        boxSizing: "border-box",
        ...props.style,

        width: w ?? initialWidth,
        height: h ?? initialHeight,

        maxWidth: maxWidth,
        maxHeight: maxHeight,
        minWidth: minWidth,
        minHeight: minHeight,
      }}
    >
      <div ref={setResizeAnnouncer} style={srOnlyStyle} role="status" aria-live="polite"></div>
      {movable && (
        <div
          role="button"
          aria-label={axe.axeMoveLabel}
          aria-description={axe.axeMoveDescription}
          className={headerClassName}
          style={headerStyle}
          onKeyDown={(e) => {
            const step = 10;

            switch (e.key) {
              case "ArrowUp":
                onMove?.(x, Math.max(0, y - step));
                break;
              case "ArrowDown":
                onMove?.(x, Math.min(window.innerHeight - h!, y + step));
                break;
              case "ArrowLeft":
                onMove?.(Math.max(x - 10, 0), y);
                break;
              case "ArrowRight":
                onMove?.(Math.min(window.innerWidth - w!, x + step), y);
                break;
            }
          }}
          tabIndex={0}
          onPointerDown={(el) => {
            handleMove(
              el.nativeEvent,
              resizeAnnouncer!,
              axe,
              ref!,
              raf,
              onMove ?? (() => {}),
              w!,
              h!,
              sizeSync,
            );

            setTimeout(sizeSync);
          }}
        >
          {header}
        </div>
      )}
      {/* v8 ignore next */}
      {!movable && (
        <div className={headerClassName} style={headerStyle}>
          {header}
        </div>
      )}
      <div
        style={{ flex: 1, overflow: "auto", scrollbarWidth: "thin", ...contentStyle }}
        className={contentClassName}
      >
        {children}
      </div>
      <div style={{ position: "sticky", bottom: 0, height: 20 }}>
        {resizable && (
          <button
            aria-label={axe.axeResizeLabel}
            aria-description={axe.axeResizeDescription}
            onKeyDown={(e) => {
              const step = 10;

              switch (e.key) {
                case "ArrowUp":
                  sizeChange(w!, h! - step);
                  break;
                case "ArrowDown":
                  sizeChange(w!, h! + step);
                  break;
                case "ArrowLeft":
                  sizeChange(w! - step, h!);
                  break;
                case "ArrowRight":
                  sizeChange(w! + step, h!);
                  break;
              }
            }}
            onPointerDown={(el) => {
              if (raf.current) cancelAnimationFrame(raf.current);
              raf.current = requestAnimationFrame(() => {
                handleResize(
                  el.nativeEvent,
                  resizeAnnouncer!,
                  axe,
                  x,
                  y,
                  w!,
                  h!,
                  ref!,
                  (w, h) => {
                    sizeChange(w, h);
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
        )}
      </div>
    </Dialog>
  );
}

/**
 * A draggable and resizable frame component with accessibility support.
 *
 * @component
 * @example
 * ```tsx
 * <Frame
 *   show={isVisible}
 *   onShowChange={setIsVisible}
 *   x={100}
 *   y={100}
 *   width={400}
 *   height={300}
 *   header={<div>Frame Title</div>}
 *   axe={{
 *     axeResizeLabel: "Resize frame",
 *     axeResizeDescription: "Use arrow keys to resize",
 *     axeResizeStartText: (w, h) => `Starting resize at ${w}x${h}`,
 *     axeResizeEndText: (w, h) => `Finished resize at ${w}x${h}`,
 *     axeMoveLabel: "Move frame",
 *     axeMoveDescription: "Use arrow keys to move",
 *     axeMoveStartText: (x, y) => `Starting move at ${x},${y}`,
 *     axeMoveEndText: (x, y) => `Finished move at ${x},${y}`
 *   }}
 * >
 *   Frame content goes here
 * </Frame>
 * ```
 *
 * @param props - Component props
 * @param props.show - Controls visibility of the frame
 * @param props.onShowChange - Callback fired when visibility changes
 * @param props.x - Horizontal position of the frame
 * @param props.y - Vertical position of the frame
 * @param props.width - Current width of the frame. If null, uses internal state
 * @param props.height - Current height of the frame. If null, uses internal state
 * @param props.movable - Whether the frame can be moved by dragging (default: true)
 * @param props.resizable - Whether the frame can be resized (default: true)
 * @param props.onSizeChange - Callback fired when frame is resized
 * @param props.onMove - Callback fired when frame is moved
 * @param props.initialWidth - Initial width of the frame
 * @param props.initialHeight - Initial height of the frame
 * @param props.maxHeight - Maximum allowed height
 * @param props.maxWidth - Maximum allowed width
 * @param props.minHeight - Minimum allowed height
 * @param props.minWidth - Minimum allowed width
 * @param props.header - Content to render in the frame header
 * @param props.axe - Accessibility props for resize and move operations
 *
 * @returns A draggable and resizable frame component
 */
export const Frame = refCompat(FrameImpl, "Frame");
