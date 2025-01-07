import { SplitPane } from "../src/split-pane";

export default function Home() {
  return (
    <div style={{ height: 500 }}>
      <SplitPane orientation="horizontal" minSize={100} maxSize={500} defaultSize={250}>
        <div style={{ background: "#f5f5f5", width: "100%" }}>Left Panel</div>
        <div style={{ background: "#eaeaea", width: "100%" }}>Right Panel</div>
      </SplitPane>
    </div>
  );
}
