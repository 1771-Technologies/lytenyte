import type { Frame } from "@/components/frame-dropdown";
import { useRef, useState } from "react";

export interface FrameDemo {
  readonly value: string;
  readonly label: string;
  readonly path: string[];
}

export function IFrameSwitcher({
  frame,
  demoA,
  demoB,
  setDemoA,
  setDemoB,
}: {
  frame: Frame;
  demoA: FrameDemo | null;
  demoB: FrameDemo | null;
  setDemoB: (x: FrameDemo | null) => void;
  setDemoA: (x: FrameDemo | null) => void;
}) {
  const [active, setActive] = useState<"A" | "B" | null>(null);
  const aRef = useRef<HTMLIFrameElement>(null);
  const bRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="flex h-full justify-center p-4">
      <div
        style={{
          width: frame.width ?? "100%",
          height: frame.height ?? "100%",
          transitionProperty: "width height",
          transitionTimingFunction: "ease-in-out",
          transitionDuration: "200ms",
        }}
        className="border-border rounded border"
      >
        {demoA && (
          <iframe
            key="A"
            ref={aRef}
            title="Play Frame A"
            src={`/?frame=${demoA.value}`}
            onLoad={() => {
              setTimeout(() => {
                setActive("A");
                setDemoB(null);
              }, 200);
            }}
            style={{
              opacity: demoB ? 0 : 1,
              display: active === "A" ? undefined : "none",
              border: "0px",
              height: "100%",
              width: "100%",
            }}
          />
        )}
        {demoB && (
          <iframe
            key="B"
            ref={bRef}
            title="Play Frame B"
            src={`/?frame=${demoB.value}`}
            onLoad={() => {
              setTimeout(() => {
                setActive("B");
                setDemoA(null);
              }, 200);
            }}
            style={{
              display: active === "B" ? undefined : "none",
              border: "0px",
              opacity: demoA ? 0 : 1,
              height: "100%",
              width: "100%",
            }}
          />
        )}
      </div>
    </div>
  );
}
