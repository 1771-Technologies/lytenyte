import { useState } from "react";
import { Grid, useClientDataSource } from "../../index.js";

const columns = Array.from({ length: 30 }, (_, i) => ({ id: `${i}` }));
const rows = Array.from({ length: 500 }, (_, i) => ({ i }));

export default function ReactivityGrid() {
  const source = useClientDataSource({ data: rows });

  const [rowHeight, setRowHeight] = useState(20);

  return (
    <>
      <button onClick={() => setRowHeight(20)}>Set 20</button>
      <button onClick={() => setRowHeight(40)}>Set 40</button>
      <button onClick={() => setRowHeight(60)}>Set 60</button>

      <div style={{ width: "500px", height: "500px" }}>
        <Grid
          styles={{ viewport: { style: { border: "1px solid black" } } }}
          columns={columns}
          rowSource={source}
          rowHeight={rowHeight}
        />
      </div>
    </>
  );
}

if (import.meta.vitest) {
  const { wait } = await import("@1771technologies/js-utils");
  const { test, expect } = import.meta.vitest;
  const r = await import("vitest-browser-react");

  test("Should adjust the grid's row height based on the reactive variable change", async () => {
    const screen = await r.render(<ReactivityGrid />);

    await wait(100);

    const grid = screen.getByRole("grid");
    await expect.element(grid).toBeVisible();

    const firstRow = screen.getByRole("row").getByRole("gridcell").nth(2);
    await expect.element(firstRow).toHaveStyle({ height: "20px" });

    await screen.getByText("Set 40").click();
    await expect.element(firstRow).toHaveStyle({ height: "40px" });

    await screen.getByText("Set 60").click();
    await expect.element(firstRow).toHaveStyle({ height: "60px" });

    await screen.getByText("Set 20").click();
    await expect.element(firstRow).toHaveStyle({ height: "20px" });
  });
}
