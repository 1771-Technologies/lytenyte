import "../test.css";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { Grid, useClientDataSource } from "../../index.js";

interface Spec {
  readonly data: (typeof bankDataSmall)[number];
}

const columns: Grid.Column<Spec>[] = [
  { id: "age" },
  { id: "job" },
  { id: "balance" },
  { id: "education" },
  { id: "marital" },
  { id: "default" },
  { id: "housing" },
  { id: "loan" },
  { id: "contact" },
  { id: "day" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome", name: "P Outcome" },
  { id: "y" },
];

export default function FlatColumns() {
  const ds = useClientDataSource({
    data: bankDataSmall,
  });

  return (
    <div style={{ width: "800px", height: "1000px", border: "1px solid black" }}>
      <Grid columns={columns} rowSource={ds} />
    </div>
  );
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  const r = await import("vitest-browser-react");

  test("should display the headers of the grid correctly", async () => {
    const screen = await r.render(<FlatColumns />);

    const grid = screen.getByRole("grid");
    await expect.element(grid).toBeVisible();
    await expect.element(grid).toMatchScreenshot("001_flat_headers_rendering");

    // We need to check that virtualization is working correctly. Since the grid should only have 4 visible
    // columns.

    // Scroll the grid
    // Snap screenshot
    // Check virtualization
  });
}
