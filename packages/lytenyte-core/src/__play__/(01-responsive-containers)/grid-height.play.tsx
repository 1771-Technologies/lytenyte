import { Grid, useClientDataSource } from "../../index.js";

const columns = Array.from({ length: 30 }, (_, i) => ({ id: `${i}` }));
const rows = Array.from({ length: 500 }, (_, i) => ({ i }));

export default function GridHeightGrid() {
  const source = useClientDataSource({ data: rows });
  return (
    <div style={{ width: "500px", height: "500px", display: "grid", gridTemplateRows: "auto 1fr" }}>
      <div style={{ height: "50px", width: "100%" }} />
      <div style={{ width: "100%" }}>
        <Grid
          styles={{ viewport: { style: { border: "1px solid black" } } }}
          columns={columns}
          rowSource={source}
        />
      </div>
    </div>
  );
}

if (import.meta.vitest) {
  const { wait } = await import("@1771technologies/js-utils");
  const { test, expect } = import.meta.vitest;
  const r = await import("vitest-browser-react");

  test("Should render the grid with a flex height", async () => {
    const screen = await r.render(<GridHeightGrid />);

    await wait(100);

    const grid = screen.getByRole("grid");
    await expect.element(grid).toBeVisible();

    const gridEl = grid.element();

    expect(gridEl.getBoundingClientRect()).toMatchInlineSnapshot(`
      {
        "bottom": 500,
        "height": 450,
        "left": 0,
        "right": 500,
        "top": 50,
        "width": 500,
        "x": 0,
        "y": 50,
      }
    `);
  });
}
