import { useEffect, useState } from "react";
import { getPosition } from "../src/get-position.js";
import type { Placement } from "../src/types.js";

export default function Play() {
  const [x, setX] = useState<HTMLElement | null>(null);
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [placement, setPlacement] = useState<Placement>("left");

  const [offset, setOffset] = useState(8);

  useEffect(() => {
    if (!x || !ref) return;

    const reference = ref.getBoundingClientRect();
    const floating = x.getBoundingClientRect();

    const pos = getPosition({
      floating,
      placement,
      reference,
      offset: 12,
    });

    x.style.top = `${pos.y}px`;
    x.style.insetInlineStart = `${pos.x}px`;
  }, [offset, placement, ref, x]);

  return (
    <div>
      <br />
      <button onClick={() => setPlacement("left-start")}>left-start</button>
      <button onClick={() => setPlacement("left")}>left</button>
      <button onClick={() => setPlacement("left-end")}>left-end</button>
      <br />

      <button onClick={() => setPlacement("right-start")}>right-start</button>
      <button onClick={() => setPlacement("right")}>right</button>
      <button onClick={() => setPlacement("right-end")}>right-end</button>

      <br></br>

      <button onClick={() => setPlacement("top-start")}>top-start</button>
      <button onClick={() => setPlacement("top")}>top</button>
      <button onClick={() => setPlacement("top-end")}>top-end</button>

      <br></br>

      <button onClick={() => setPlacement("bottom-start")}>bottom-start</button>
      <button onClick={() => setPlacement("bottom")}>bottom</button>
      <button onClick={() => setPlacement("bottom-end")}>bottom-end</button>

      <br />
      <button onClick={() => setOffset((prev) => prev + 1)}>Inc</button>
      <span>{offset}</span>
      <button onClick={() => setOffset((prev) => prev - 1)}>Decr</button>

      <div
        className={css`
          width: 300px;
          height: 300px;
          border: 1px solid black;
          display: flex;
          align-items: center;
          justify-content: center;
        `}
      >
        <div
          ref={setX}
          className={css`
            width: 20px;
            height: 20px;
            background-color: red;
            position: fixed;
            z-index: 2;
          `}
        ></div>
        <div
          ref={setRef}
          className={css`
            width: 50px;
            height: 50px;
            background-color: black;
            border: 1px solid yellow;
          `}
        ></div>
      </div>
    </div>
  );
}
