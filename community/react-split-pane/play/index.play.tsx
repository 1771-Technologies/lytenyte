import { SplitPane } from "../src/split-pane";

export default function Home() {
  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        gap: 4px;
      `}
    >
      <div style={{ height: 500, width: 500 }}>
        <SplitPane
          primary={
            <div
              className={css`
                background-color: red;
                height: 100%;
                width: 100%;
              `}
            >
              X
            </div>
          }
          secondary={
            <div
              className={css`
                background-color: green;
                height: 100%;
              `}
            >
              Y
            </div>
          }
        />
      </div>

      <div style={{ height: 500, width: 500 }}>
        <SplitPane
          orientation="horizontal"
          primary={
            <div
              className={css`
                background-color: red;
                height: 100%;
                width: 100%;
              `}
            >
              X
            </div>
          }
          secondary={
            <div
              className={css`
                background-color: green;
                height: 100%;
              `}
            >
              Y
            </div>
          }
        />
      </div>
    </div>
  );
}
