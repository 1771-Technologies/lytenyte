import { useState } from "react";
import type { SizeChange } from "../src";
import { Sizer } from "../src";

export default function Play() {
  const [size, setSize] = useState(200);
  const [observedSize, setObservedSize] = useState<SizeChange>({
    innerHeight: 0,
    innerWidth: 0,
    outerHeight: 0,
    outerWidth: 0,
  });
  return (
    <div>
      <button onClick={() => setSize((prev) => prev + 50)}>Size Up</button>
      <button onClick={() => setSize((prev) => prev - 50)}>Size Down</button>

      <div>
        <pre>Inner Height: {observedSize.innerHeight}</pre>
        <pre>Inner Width: {observedSize.innerWidth}</pre>
        <pre>Outer Height: {observedSize.outerHeight}</pre>
        <pre>Outer Width: {observedSize.outerWidth}</pre>
      </div>

      <div style={{ width: "22.12rem", height: size, border: "1px solid black" }}>
        <div
          className={css`
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
          `}
        >
          <div>Alpha</div>
          <div
            className={css`
              flex: 1;
            `}
          >
            <Sizer onSizeChange={setObservedSize}>
              <div
                className={css`
                  width: calc(100% - 10px);
                  height: calc(100% - 10px);
                  margin: 5px;
                  background-color: red;
                `}
              ></div>
              <div style={{ width: 20000, height: 20000, background: "blue" }}></div>
            </Sizer>
          </div>
        </div>
      </div>
    </div>
  );
}
