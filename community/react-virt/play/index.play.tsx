import { memo, useState } from "react";
import { Virt, type RendererProps } from "../src/virt";

const data = Array.from({ length: 2000 }, (_, i) => i);

export default function Home() {
  const [preventFlash, setPreventFlash] = useState(false);
  return (
    <>
      <button onClick={() => setPreventFlash((p) => !p)}>
        Toggle Prevent Flash: {preventFlash ? "On" : "Off"}
      </button>
      <div style={{ width: 400, height: 600, border: "1px solid black" }}>
        <Virt data={data} itemHeight={20} renderer={Row} preventFlash={preventFlash} />
      </div>
    </>
  );
}

function RowImpl({ rowIndex, data, y }: RendererProps<number>) {
  return (
    <div
      tabIndex={-1}
      style={{ top: y }}
      className={css`
        position: absolute;
        height: 20px;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        font-size: 12px;
        font-family: monospace;
        border-bottom: 1px solid gray;
      `}
    >
      {rowIndex} | {data}
    </div>
  );
}
const Row = memo(RowImpl);
