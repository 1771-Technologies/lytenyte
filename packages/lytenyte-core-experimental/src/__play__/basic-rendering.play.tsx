import "./test.css";
import { useClientDataSource, Grid } from "../index.js";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";

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
export default function BasicRendering() {
  const ds = useClientDataSource({
    data: bankDataSmall,
    sort: [{ dim: { id: "education" } }],
  });

  return (
    <div style={{ width: "100%", height: "95vh", border: "1px solid black" }}>
      <Grid columns={columns} rowSource={ds} />
    </div>
  );
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  const utils = await import("./utils.js");
  const r = await import("vitest-browser-react");

  test("should render without any issues", async () => {
    const screen = await r.render(<BasicRendering />);

    const grid = screen.getByRole("grid");
    await expect.element(grid).toBeVisible();
    await expect.element(grid).toMatchScreenshot("001_render_without_issues.png");
    utils.scrollGrid(grid, { y: 2000 });
    await expect.element(grid).toMatchScreenshot("002_render_without_issues.png");
    utils.scrollGrid(grid, { y: 2_000_000 });
    await expect.element(grid).toMatchScreenshot("003_render_without_issues.png");
  });
}
