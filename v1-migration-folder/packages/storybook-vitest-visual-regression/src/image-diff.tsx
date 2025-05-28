import React, { useState } from "react";
import { ImageDiff } from "./image";
import { css } from "goober";

export interface ImageDifferProps {
  readonly expected: string;
  readonly actual: string;
}
export function ImageDiffer({ expected, actual }: ImageDifferProps) {
  const [type, setType] = useState("difference");
  const [value, setValue] = useState(0);
  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        gap: 8px;
      `}
    >
      <div
        className={css`
          display: flex;
          width: 200px;
          gap: 8px;
        `}
      >
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(+e.target.value)}
        />
        <button onClick={() => setType("difference")}>Difference</button>
        <button onClick={() => setType("fade")}>Fade</button>
        <button onClick={() => setType("swipe")}>Swipe</button>
      </div>
      <ImageDiff before={expected} after={actual} type={type} value={value / 100} />
    </div>
  );
}
