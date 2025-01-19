import { getPreciseElementDimensions, IsoResizeObserver } from "@1771technologies/js-utils";
import { useCombinedRefs } from "@1771technologies/react-utils";
import {
  useCallback,
  useEffect,
  useRef,
  type PropsWithChildren,
  useState,
  type JSX,
  type RefObject,
} from "react";

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
  elRef,
  ...props
}: PropsWithChildren<SizerProps> &
  Omit<JSX.IntrinsicElements["div"], "ref"> & {
    elRef?: RefObject<HTMLDivElement | null> | ((el: HTMLDivElement | null) => void);
  }) {
  const ref = useRef<ResizeObserver>(null);

  const [size, setSize] = useState<SizeChange | null>(null);

  useEffect(() => {
    return () => ref.current?.disconnect();
  }, []);

  const init = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;

    const resize = new IsoResizeObserver(() => {
      const dims = getPreciseElementDimensions(el);
      setSize(dims);
    });

    const dims = getPreciseElementDimensions(el);
    setSize(dims);

    resize.observe(el);
    ref.current = resize;
  }, []);

  const [inner, setInner] = useState<HTMLDivElement | null>(null);
  const combined = useCombinedRefs(elRef, setInner);

  useEffect(() => {
    if (!inner) return;

    const resizer = new IsoResizeObserver(() => {
      const dims = getPreciseElementDimensions(inner);
      onSizeChange?.(dims);
    });

    resizer.observe(inner);

    const dims = getPreciseElementDimensions(inner);
    onSizeChange?.(dims);

    return () => resizer.disconnect();
  }, [inner, onInit, onSizeChange]);

  return (
    <div
      style={{
        minHeight: "inherit",
        maxHeight: "inherit",
        height: "100%",
        width: "100%",
        minWidth: "inherit",
        maxWidth: "inherit",
        position: "relative",
      }}
    >
      <div
        ref={init}
        style={{
          position: "absolute",
          minHeight: "inherit",
          maxHeight: "inherit",
          height: "100%",
          width: "100%",
          minWidth: "inherit",
          maxWidth: "inherit",
          pointerEvents: "none",
        }}
      />
      {size && (
        <div
          {...props}
          ref={combined}
          style={{
            width: size.innerWidth,
            height: size.innerHeight,
            position: "absolute",
            overflow: "auto",
            ...props.style,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
