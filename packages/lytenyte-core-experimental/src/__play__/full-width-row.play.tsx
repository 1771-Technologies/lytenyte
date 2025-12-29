import "./test.css";
import { Grid, useClientDataSource } from "../index.js";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";

const columns: Grid.Column[] = [
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

const rowFullWidthPredicate: Grid.Props["rowFullWidthPredicate"] = (p) =>
  p.rowIndex === 0 || p.rowIndex % 4 === 0;
const rowFullWidthRenderer: Grid.Props["rowFullWidthRenderer"] = () => (
  <div style={{ background: "green", width: "100%", height: "100%" }}>Full Width</div>
);

export default function FullWidthRow({ rtl }: { rtl?: boolean }) {
  const ds = useClientDataSource({
    data: bankDataSmall,
    topData: bankDataSmall.slice(0, 2),
    bottomData: bankDataSmall.slice(2, 4),
  });

  return (
    <div style={{ width: "100%", height: "95vh", border: "1px solid black" }}>
      <Grid
        columns={columns}
        rtl={rtl}
        rowSource={ds}
        rowFullWidthPredicate={rowFullWidthPredicate}
        rowFullWidthRenderer={rowFullWidthRenderer}
      />
    </div>
  );
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  const { wait } = await import("./utils.js");
  const { render } = await import("vitest-browser-react");

  test("should display full width rows and they should remain sticky even with scrolls", async () => {
    const screen = await render(<FullWidthRow />);

    await expect.element(screen.getByRole("grid")).toBeVisible();
    await wait(100);

    await expect.element(screen.getByRole("grid")).toMatchScreenshot("full_width_001");

    const grid = screen.getByRole("grid").element();

    grid.scrollBy({ left: 200, top: 400 });
    await wait(100);
    await expect.element(screen.getByRole("grid")).toMatchScreenshot("full_width_002");

    grid.scrollBy({ left: 40000, top: 400 });
    await wait(100);
    await expect.element(screen.getByRole("grid")).toMatchScreenshot("full_width_003");
  });

  test("should display full width rows and they should remain sticky even with scrolls rtl", async () => {
    const screen = await render(<FullWidthRow rtl />);

    await expect.element(screen.getByRole("grid")).toBeVisible();
    await wait(100);

    await expect.element(screen.getByRole("grid")).toMatchScreenshot("full_width_001-rtl");

    const grid = screen.getByRole("grid").element();

    grid.scrollBy({ left: -200, top: 400 });
    await wait(100);
    await expect.element(screen.getByRole("grid")).toMatchScreenshot("full_width_002-rtl");

    grid.scrollBy({ left: -40000, top: 400 });
    await wait(100);
    await expect.element(screen.getByRole("grid")).toMatchScreenshot("full_width_003-rtl");
  });
}
