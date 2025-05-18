import { SplitPane } from "../src/split-pane";
import { splitPaneAxe } from "../src/split-pane-axe";

export default function Home() {
  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        gap: 4px;
      `}
    >
      <div style={{ height: 500, width: "100%" }}>
        <SplitPane
          min={20}
          max={80}
          axe={splitPaneAxe}
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
          axe={splitPaneAxe}
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
