import { getPreciseElementDimensions, IsoResizeObserver } from "@1771technologies/js-utils";
import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type PropsWithChildren,
  useState,
} from "react";

export interface SizeChange {
  innerWidth: number;
  innerHeight: number;
  outerHeight: number;
  outerWidth: number;
}

export interface SizerProps {
  className?: string;
  style?: CSSProperties;
  onSizeChange?: (size: SizeChange) => void;
  onInit?: (element: HTMLDivElement, size: SizeChange) => void;
  id?: string;
}

export function Sizer({
  className,
  style,
  children,
  id,
  onSizeChange,
  onInit,
}: PropsWithChildren<SizerProps>) {
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
    <div
      className={className}
      id={id}
      style={{
        ...style,
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
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
          style={{
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
