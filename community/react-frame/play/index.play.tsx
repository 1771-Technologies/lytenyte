import { useState } from "react";
import { Frame } from "../src/frame.js";
import { defaultAxeProps } from "../src/default-axe-props.js";

export default function Play() {
  const [w, setW] = useState<number | null>(null);
  const [h, setH] = useState<number | null>(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [show, setShow] = useState(false);

  return (
    <div>
      <div>Width: {w}</div>
      <div>Height: {h}</div>
      <button onClick={() => setShow((prev) => !prev)}>Show Frame</button>
      <Frame
        onShowChange={setShow}
        show={show}
        x={x}
        y={y}
        width={w}
        height={h}
        maxWidth={"220vw"}
        header={<div>This is my header content</div>}
        axe={defaultAxeProps}
        onSizeChange={(w, h) => {
          setW(w);
          setH(h);
        }}
        onMove={(x, y) => {
          setX(x);
          setY(y);
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
