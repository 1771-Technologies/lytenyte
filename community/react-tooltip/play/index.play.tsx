import { useRef } from "react";
import { Tooltip, type TooltipApi } from "../src/tooltip";

export default function Home() {
  const ref = useRef<TooltipApi | null>(null);

  return (
    <div
      className={css`
        width: 500px;
        height: 500px;
        display: flex;
        align-items: center;
        justify-content: center;
      `}
    >
      <button
        onMouseEnter={(ev) => {
          ref.current?.show({
            id: "x",
            content: <div>This is content</div>,
            target: ev.currentTarget,
          });
        }}
        onMouseLeave={() => {
          ref.current?.close("x");
        }}
      >
        My Button
      </button>
      <Tooltip
        ref={ref}
        onInit={(el) => {
          el.style.opacity = "0";
        }}
        onOpen={(el) => {
          el.style.opacity = "1";
        }}
        onClose={(el) => {
          el.style.opacity = "0";
        }}
      />
    </div>
  );
}
