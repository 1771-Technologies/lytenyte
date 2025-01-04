import { useState } from "react";
import { Frame } from "../src/frame";

export default function Play() {
  const [w, setW] = useState<number | null>(null);
  const [h, setH] = useState<number | null>(null);
  return (
    <div>
      <div>Width: {w}</div>
      <div>Height: {h}</div>
      <Frame
        onShowChange={() => {}}
        show
        x={0}
        y={0}
        width={w}
        height={h}
        maxWidth={"220vw"}
        header={<div>This is my header content</div>}
        onSizeChange={(w, h) => {
          setW(w);
          setH(h);
        }}
        className={css`
          &::backdrop {
            background-color: transparent;
          }
        `}
      >
        This is my driver content. I put a lot of content into it.
      </Frame>
    </div>
  );
}
