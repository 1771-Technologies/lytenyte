import { Sizer } from "../src";

export default function Mins() {
  return (
    <div
      className={css`
        min-width: 200px;
        min-height: 200px;
        max-width: 250px;
        max-height: 250px;
        border: 1px solid black;
      `}
    >
      <Sizer>
        <div
          className={css`
            width: 100%;
            height: 100%;
            background-color: green;
          `}
        ></div>
      </Sizer>
    </div>
  );
}
