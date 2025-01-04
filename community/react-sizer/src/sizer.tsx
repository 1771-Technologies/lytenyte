import { getPreciseElementDimensions, IsoResizeObserver } from "@1771technologies/js-utils";
import { useCallback, useEffect, useRef, type PropsWithChildren, useState } from "react";

export interface SizeChange {
  innerWidth: number;
  innerHeight: number;
  outerHeight: number;
  outerWidth: number;
}

export interface SizerProps {
  onSizeChange?: (size: SizeChange) => void;
  onInit?: (element: HTMLDivElement, size: SizeChange) => void;
}

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
