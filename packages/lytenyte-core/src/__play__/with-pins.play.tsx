import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { useClientDataSource, Grid } from "../index.js";

const baseColumns: Grid.Column[] = [
  { id: "age", pin: "start" },
  { id: "job", pin: "start" },
  { id: "balance", width: 260 },
  { id: "education", width: 120 },
  { id: "marital", width: 180 },
  { id: "default" },
  { id: "housing", colSpan: 2 },
  { id: "loan" },
  { id: "contact" },
  { id: "day" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome", pin: "end" },
  { id: "y" },
];
export default function WithPins({
  rtl,
  columns,
  pinTop,
  center,
  pinBot,
  floatingRow,
}: {
  rtl?: boolean;
  columns?: Grid.Column[];
  center?: number;
  pinTop?: number;
  pinBot?: number;
  floatingRow?: boolean;
}) {
  const ds = useClientDataSource({
    data: center ? bankDataSmall.slice(0, center) : bankDataSmall,
    topData: pinTop ? bankDataSmall.slice(0, pinTop) : [],
    bottomData: pinBot ? bankDataSmall.slice(0, pinBot) : [],
  });

  return (
    <div className="with-border-cells">
      <button tabIndex={0} onClick={() => {}}>
        Top Capture
      </button>
      <div style={{ width: "100%", height: "90vh", border: "1px solid black" }}>
        <Grid floatingRowEnabled={floatingRow} rtl={rtl} columns={columns ?? baseColumns} rowSource={ds} />
      </div>
      <button tabIndex={0} onClick={() => {}}>
        Bottom Capture
      </button>
    </div>
  );
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  const { wait } = await import("./utils.js");
  const { render } = await import("vitest-browser-react");

  test("The layout should look correct when pins are presents", async () => {
    const screen = await render(<WithPins />);

    const grid = screen.getByRole("grid");
    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    grid.element().focus();
    await expect.element(grid).toHaveFocus();

    await expect.element(grid).toMatchScreenshot("001-with-pins-start");
    grid.element().scrollBy({ top: 200, left: 300 });

    await wait();
    await expect.element(grid).toMatchScreenshot("002-with-pins-middle");

    grid.element().scrollBy({ top: 200, left: 2000 });
    await expect.element(grid).toMatchScreenshot("003-with-pins-end");
  });

  test("The layout should look correct when pins are present rtl", async () => {
    const screen = await render(<WithPins rtl />);

    const grid = screen.getByRole("grid");
    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    grid.element().focus();
    await expect.element(grid).toHaveFocus();

    await expect.element(grid).toMatchScreenshot("001-with-pins-start-rtl");
    grid.element().scrollBy({ top: 200, left: -300 });

    await wait();
    await expect.element(grid).toMatchScreenshot("002-with-pins-middle-rtl");
    grid.element().scrollBy({ top: 200, left: -2000 });
    await expect.element(grid).toMatchScreenshot("003-with-pins-end-rtl");
  });
}
