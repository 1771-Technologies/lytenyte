import { getPreciseElementDimensions, IsoResizeObserver } from "@1771technologies/js-utils";
import { useCallback, useEffect, useRef, type PropsWithChildren, useState } from "react";

/**
 * Represents the dimensions of an element, including both inner and outer measurements.
 */
export interface SizeChange {
  /** The inner width of the element in pixels */
  innerWidth: number;
  /** The inner height of the element in pixels */
  innerHeight: number;
  /** The outer height of the element including borders and padding in pixels */
  outerHeight: number;
  /** The outer width of the element including borders and padding in pixels */
  outerWidth: number;
}

/**
 * Props for the Sizer component.
 */
export interface SizerProps {
  /**
   * Callback function triggered when the size of the element changes.
   * @param size - The new dimensions of the element
   */
  onSizeChange?: (size: SizeChange) => void;

  /**
   * Callback function triggered when the element is first initialized.
   * @param element - The HTML div element that was initialized
   * @param size - The initial dimensions of the element
   */
  onInit?: (element: HTMLDivElement, size: SizeChange) => void;
}

/**
 * A component that wraps its children in a container that monitors size changes.
 * The component uses ResizeObserver to detect size changes and provides precise
 * measurements of the container's dimensions.
 *
 * @example
 * ```tsx
 * <Sizer
 *   onSizeChange={(size) => console.log('New size:', size)}
 *   onInit={(el, size) => console.log('Initialized:', size)}
 * >
 *   <div>Content that needs size monitoring</div>
 * </Sizer>
 * ```
 *
 * @remarks
 * The component creates a wrapper div that takes up 100% of its parent's width and height.
 * Inside this wrapper, it creates two divs:
 * 1. An absolute-positioned div used for size monitoring
 * 2. Another absolute-positioned div that contains the actual children
 *
 * The component will only render its children once it has obtained initial size measurements.
 *
 * @param props - Component props extending both SizerProps and standard div element props
 * @param props.children - The content to be rendered inside the size-monitored container
 * @param props.onSizeChange - Optional callback for size change events
 * @param props.onInit - Optional callback for initialization
 * @param props.style - Additional styles to apply to the container
 * @returns A React component that monitors its size and renders children accordingly
 */
export function Sizer({
  children,
  onSizeChange,
  onInit,
  ...props
}: PropsWithChildren<SizerProps> & JSX.IntrinsicElements["div"]) {
  const ref = useRef<ResizeObserver>();

  const [size, setSize] = useState<SizeChange | null>(null);

  useEffect(() => {
    return () => ref.current?.disconnect();
  }, []);
  const init = useCallback(
    (el: HTMLDivElement | null) => {
      if (!el) return;

      const resize = new IsoResizeObserver(() => {
        const dims = getPreciseElementDimensions(el);
        onSizeChange?.(dims);
        setSize(dims);
      });

      const dims = getPreciseElementDimensions(el);
      onInit?.(el, dims);
      setSize(dims);

      resize.observe(el);
      ref.current = resize;
    },
    [onSizeChange, onInit],
  );

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        ref={init}
        style={{
          position: "absolute",
          inlineSize: "100%",
          blockSize: "100%",
          pointerEvents: "none",
        }}
      />
      {size && (
        <div
          {...props}
          style={{
            ...props.style,
            width: size.innerWidth,
            height: size.innerHeight,
            position: "absolute",
            overflow: "auto",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
