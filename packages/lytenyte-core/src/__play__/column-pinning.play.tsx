import "./test.css";
import { useEffect, useState } from "react";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { useClientDataSource, Grid } from "../index.js";

const setsGlobal: Record<string, Grid.Column[]> = {
  "One Start": [{ id: "age", pin: "start" }],
  "Two Start": [
    { id: "age", pin: "start" },
    { id: "job", pin: "start", width: 110 },
  ],
  "Three Start": [
    { id: "age", pin: "start" },
    { id: "job", pin: "start", width: 110 },
    { id: "marital", pin: "start", width: 160 },
  ],
  "One End": [{ id: "age", pin: "end" }],
  "Two End": [
    { id: "age", pin: "end" },
    { id: "job", pin: "end", width: 110 },
  ],
  "Three End": [
    { id: "age", pin: "end" },
    { id: "job", pin: "end", width: 110 },
    { id: "marital", pin: "end", width: 160 },
  ],
  "One Start and End": [
    { id: "age", pin: "end" },
    { id: "job", pin: "start", width: 110 },
  ],
  "Two Start and End": [
    { id: "age", pin: "start" },
    { id: "job", pin: "start", width: 110 },
    { id: "age1", field: "age", pin: "end" },
    { id: "job1", field: "job", pin: "end", width: 110 },
  ],
  "Two Start and Scrollable": [
    { id: "age", pin: "start" },
    { id: "job", pin: "start", width: 110 },

    { id: "default", width: 220 },
    { id: "housing", width: 110 },
    { id: "loan", width: 220 },
    { id: "contact", width: 100 },
    { id: "day", width: 400 },
    { id: "month" },
    { id: "duration", width: 111 },
    { id: "default1", width: 220 },
    { id: "housing1", width: 110 },
    { id: "loan1", width: 220 },
    { id: "contact1", width: 100 },
    { id: "day1", width: 400 },
    { id: "month1" },
    { id: "duration1", width: 111 },
  ],
  "Two Start, Two End and Scrollable": [
    { id: "age", pin: "start" },
    { id: "job", pin: "start", width: 110 },

    { id: "default", width: 220 },
    { id: "housing", width: 110 },
    { id: "loan", width: 220 },
    { id: "contact", width: 100 },
    { id: "day", width: 400 },
    { id: "month" },
    { id: "duration", width: 111 },
    { id: "default1", width: 220 },
    { id: "housing1", width: 110 },
    { id: "loan1", width: 220 },
    { id: "contact1", width: 100 },
    { id: "day1", width: 400 },
    { id: "month1" },
    { id: "duration1", width: 111 },

    { id: "age1", field: "age", pin: "end" },
    { id: "job1", field: "job", pin: "end", width: 110 },
  ],
  "One Start, Two End, and Scrollable": [
    { id: "age", pin: "start" },

    { id: "default", width: 220 },
    { id: "housing", width: 110 },
    { id: "loan", width: 220 },
    { id: "contact", width: 100 },
    { id: "day", width: 400 },
    { id: "month" },
    { id: "duration", width: 111 },
    { id: "default1", width: 220 },
    { id: "housing1", width: 110 },
    { id: "loan1", width: 220 },
    { id: "contact1", width: 100 },
    { id: "day1", width: 400 },
    { id: "month1" },
    { id: "duration1", width: 111 },

    { id: "age1", field: "age", pin: "end" },
    { id: "job1", field: "job", pin: "end", width: 110 },
  ],
  "Two Start, One End, and Scrollable": [
    { id: "age", pin: "start" },
    { id: "job", pin: "start", width: 110 },

    { id: "default", width: 220 },
    { id: "housing", width: 110 },
    { id: "loan", width: 220 },
    { id: "contact", width: 100 },
    { id: "day", width: 400 },
    { id: "month" },
    { id: "duration", width: 111 },
    { id: "default1", width: 220 },
    { id: "housing1", width: 110 },
    { id: "loan1", width: 220 },
    { id: "contact1", width: 100 },
    { id: "day1", width: 400 },
    { id: "month1" },
    { id: "duration1", width: 111 },

    { id: "job1", field: "job", pin: "end", width: 110 },
  ],
  "Two Start, Two End, and Many Scrollable": [
    { id: "age", pin: "start" },
    { id: "job", pin: "start", width: 110 },

    ...Array.from({ length: 50 }, (_, i) => {
      return [
        { field: "default", id: `${i}` + "default", width: 220 },
        { field: "housing", id: `${i}` + "housing", width: 110 },
        { field: "loan", id: `${i}` + "loan", width: 220 },
        { field: "contact", id: `${i}` + "contact", width: 100 },
        { field: "day", id: `${i}` + "day", width: 300 },
        { field: "month", id: `${i}` + "month" },
        { field: "duration", id: `${i}` + "duration", width: 111 },
      ];
    }).flat(),

    { id: "age1", field: "age", pin: "end" },
    { id: "job1", field: "job", pin: "end", width: 110 },
  ],

  "Two Start (with groups), Two End, and Scrollable": [
    { id: "age", pin: "start", groupPath: ["A", "Beta"] },
    { id: "job", pin: "start", width: 110, groupPath: ["A"] },

    { id: "default", width: 220 },
    { id: "housing", width: 110 },
    { id: "loan", width: 220 },
    { id: "contact", width: 100 },
    { id: "day", width: 400 },
    { id: "month" },
    { id: "duration", width: 111 },
    { id: "default1", width: 220 },
    { id: "housing1", width: 110 },
    { id: "loan1", width: 220 },
    { id: "contact1", width: 100 },
    { id: "day1", width: 400 },
    { id: "month1" },
    { id: "duration1", width: 111 },

    { id: "age1", field: "age", pin: "end" },
    { id: "job1", field: "job", pin: "end", width: 110 },
  ],

  "Two Start, Two End (with groups), and Scrollable": [
    { id: "age", pin: "start", groupPath: ["A", "Beta"] },
    { id: "job", pin: "start", width: 110, groupPath: ["A"] },

    { id: "default", width: 220 },
    { id: "housing", width: 110 },
    { id: "loan", width: 220 },
    { id: "contact", width: 100 },
    { id: "day", width: 400 },
    { id: "month" },
    { id: "duration", width: 111 },
    { id: "default1", width: 220 },
    { id: "housing1", width: 110 },
    { id: "loan1", width: 220 },
    { id: "contact1", width: 100 },
    { id: "day1", width: 400 },
    { id: "month1" },
    { id: "duration1", width: 111 },

    { id: "age1", field: "age", pin: "end", groupPath: ["A", "Beta"] },
    { id: "job1", field: "job", pin: "end", width: 110, groupPath: ["A"] },
  ],

  "Two Start, Two End, and Scrollable (with groups)": [
    { id: "age", pin: "start", groupPath: ["A", "Beta"] },
    { id: "job", pin: "start", width: 110, groupPath: ["A"] },

    { id: "default", width: 220 },
    { id: "housing", width: 110, groupPath: ["A"] },
    { id: "loan", width: 220, groupPath: ["A"] },
    { id: "contact", width: 100 },
    { id: "day", width: 400, groupPath: ["Beta", "Right", "Fight"] },
    { id: "month" },
    { id: "duration", width: 111 },
    { id: "default1", width: 220 },
    { id: "housing1", width: 110 },
    { id: "loan1", width: 220 },
    { id: "contact1", width: 100 },
    { id: "day1", width: 400 },
    { id: "month1" },
    { id: "duration1", width: 111 },

    { id: "age1", field: "age", pin: "end", groupPath: ["A", "Beta"] },
    { id: "job1", field: "job", pin: "end", width: 110, groupPath: ["A"] },
  ],
};

export default function ColumnPinning({
  initial = "Two Start, One End, and Scrollable",
}: {
  initial?: keyof typeof setsGlobal;
}) {
  const sets = setsGlobal as Record<string, Grid.Column[]>;
  const [rtl, setRtl] = useState(false);

  const ds = useClientDataSource({
    data: bankDataSmall,
    topData: bankDataSmall.slice(0, 2),
    bottomData: bankDataSmall.slice(0, 2),
  });

  const [marker, setMarker] = useState<Grid.ColumnMarker>({
    on: false,
    width: 40,
  });
  const [base] = useState<Grid.ColumnBase>({
    width: 180,
    widthFlex: 0,
    cellRenderer: (p) => {
      const field = p.api.columnField(p.column, p.row);

      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingInline: "8px",
            boxSizing: "border-box",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {field as string}
        </div>
      );
    },
  });

  const [columns, setColumns] = useState(sets["One Start"]);

  const values = Object.keys(sets);
  const [colSet, setColSet] = useState<string>(initial);

  useEffect(() => {
    setColumns(sets[colSet]);
  }, [colSet, sets]);

  return (
    <div className="with-border">
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button onClick={() => setRtl((prev) => !prev)}>
          Toggle RTL: {rtl ? "Currently On" : "Currently Off"}
        </button>
        <button onClick={() => setMarker((prev) => ({ ...prev, on: !prev.on }))}>
          Toggle Marker: {marker ? "Currently On" : "Currently Off"}
        </button>
        <label>
          Column Sets
          <select value={colSet} onChange={(e) => setColSet(e.target.value)}>
            {values.map((c) => {
              return (
                <option value={c} key={c}>
                  {c}
                </option>
              );
            })}
          </select>
        </label>
      </div>
      <div style={{ width: "100%", height: "90vh", border: "1px solid rgba(0,0,0,0.2)" }}>
        <Grid rtl={rtl} rowSource={ds} columns={columns} columnBase={base} columnMarker={marker} />
      </div>
    </div>
  );
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  const { userEvent } = await import("vitest/browser");
  const { wait } = await import("./utils.js");
  const { render } = await import("vitest-browser-react");

  test("should handle one start", async () => {
    const screen = await render(<ColumnPinning initial="One Start" />);

    await expect.element(screen.getByRole("grid")).toBeVisible();
    await wait(100);

    await expect.element(screen.getByRole("grid")).toMatchScreenshot("one_start_001");
    await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
    await wait(100);
    await expect.element(screen.getByRole("grid")).toMatchScreenshot("one_start_002-rtl");
  });

  test("should handle two start", async () => {
    const screen = await render(<ColumnPinning initial="Two Start" />);

    await expect.element(screen.getByRole("grid")).toBeVisible();
    await wait(100);

    await expect.element(screen.getByRole("grid")).toMatchScreenshot("two_start_001");
    await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));

    await wait(100);
    await expect.element(screen.getByRole("grid")).toMatchScreenshot("two_start_002-rtl");
  });

  test("should handle one end", async () => {
    const screen = await render(<ColumnPinning initial="One End" />);

    await expect.element(screen.getByRole("grid")).toBeVisible();
    await wait(100);

    await expect.element(screen.getByRole("grid")).toMatchScreenshot("one_end_001");
    await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
    await wait(100);
    await expect.element(screen.getByRole("grid")).toMatchScreenshot("one_end_002-rtl");
  });

  test("should handle two end", async () => {
    const screen = await render(<ColumnPinning initial="Two End" />);

    await expect.element(screen.getByRole("grid")).toBeVisible();
    await wait(100);

    await expect.element(screen.getByRole("grid")).toMatchScreenshot("two_end_001");
    await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
    await wait(100);
    await expect.element(screen.getByRole("grid")).toMatchScreenshot("two_end_002-rtl");
  });

  test("should handle three end", async () => {
    const screen = await render(<ColumnPinning initial="Three End" />);

    await expect.element(screen.getByRole("grid")).toBeVisible();
    await wait(100);

    await expect.element(screen.getByRole("grid")).toMatchScreenshot("three_end_001");
    await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
    await wait(100);
    await expect.element(screen.getByRole("grid")).toMatchScreenshot("three_end_002-rtl");
  });

  test("should handle one start and one end", async () => {
    const screen = await render(<ColumnPinning initial="One Start and End" />);

    await expect.element(screen.getByRole("grid")).toBeVisible();
    await wait(100);

    await expect.element(screen.getByRole("grid")).toMatchScreenshot("one_start_and_end_001");
    await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
    await wait(100);
    await expect.element(screen.getByRole("grid")).toMatchScreenshot("one_start_and_end_002-rtl");
  });

  test("should handle two start and end", async () => {
    const screen = await render(<ColumnPinning initial="Two Start and End" />);

    await expect.element(screen.getByRole("grid")).toBeVisible();
    await wait(100);

    await expect.element(screen.getByRole("grid")).toMatchScreenshot("two_start_and_end_001");
    await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
    await wait(100);
    await expect.element(screen.getByRole("grid")).toMatchScreenshot("two_start_and_end_002-rtl");
  });

  test("should handle two start and scrollable", async () => {
    const screen = await render(<ColumnPinning initial="Two Start and Scrollable" />);

    await expect.element(screen.getByRole("grid")).toBeVisible();
    await wait(100);

    await expect.element(screen.getByRole("grid")).toMatchScreenshot("two_start_and_scrollable_001");
    const grid = screen.getByRole("grid").element();
    grid.scrollBy({ left: 10_000 });
    await wait(100);
    await expect.element(screen.getByRole("grid")).toMatchScreenshot("two_start_and_scrollable_002");
    grid.scrollBy({ left: -10_000 });
    await wait(100);
    await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
    await wait(100);

    await expect.element(screen.getByRole("grid")).toMatchScreenshot("two_start_and_scrollable_003-rtl");
    grid.scrollBy({ left: -10_000 });
    await wait(100);
    await expect.element(screen.getByRole("grid")).toMatchScreenshot("two_start_and_scrollable_004-rtl");
  });

  test("should handle two start, two end, and scrollable", async () => {
    const screen = await render(<ColumnPinning initial="Two Start, Two End and Scrollable" />);

    await expect.element(screen.getByRole("grid")).toBeVisible();
    await wait(100);

    await expect.element(screen.getByRole("grid")).toMatchScreenshot("two_start_two_end_and_scrollable_001");
    const grid = screen.getByRole("grid").element();
    grid.scrollBy({ left: 10_000 });
    await wait(100);
    await expect.element(screen.getByRole("grid")).toMatchScreenshot("two_start_two_end_and_scrollable_002");
    grid.scrollBy({ left: -10_000 });
    await wait(100);
    await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
    await wait(100);

    await expect
      .element(screen.getByRole("grid"))
      .toMatchScreenshot("two_start_two_end_and_scrollable_003-rtl");
    grid.scrollBy({ left: -10_000 });
    await wait(100);
    await expect
      .element(screen.getByRole("grid"))
      .toMatchScreenshot("two_start_two_end_and_scrollable_004-rtl");
  });

  test("should handle one start, two end, and scrollable", async () => {
    const screen = await render(<ColumnPinning initial="One Start, Two End, and Scrollable" />);

    await expect.element(screen.getByRole("grid")).toBeVisible();
    await wait(100);

    await expect.element(screen.getByRole("grid")).toMatchScreenshot("one_start_two_end_and_scrollable_001");
    const grid = screen.getByRole("grid").element();
    grid.scrollBy({ left: 10_000 });
    await wait(100);
    await expect.element(screen.getByRole("grid")).toMatchScreenshot("one_start_two_end_and_scrollable_002");
    grid.scrollBy({ left: -10_000 });
    await wait(100);
    await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
    await wait(100);

    await expect
      .element(screen.getByRole("grid"))
      .toMatchScreenshot("one_start_two_end_and_scrollable_003-rtl");
    grid.scrollBy({ left: -10_000 });
    await wait(100);
    await expect
      .element(screen.getByRole("grid"))
      .toMatchScreenshot("one_start_two_end_and_scrollable_004-rtl");
  });

  test("should handle two start, one end, and scrollable", async () => {
    const screen = await render(<ColumnPinning initial="One Start, Two End, and Scrollable" />);

    await expect.element(screen.getByRole("grid")).toBeVisible();
    await wait(100);

    await expect.element(screen.getByRole("grid")).toMatchScreenshot("two_start_one_end_and_scrollable_001");
    const grid = screen.getByRole("grid").element();
    grid.scrollBy({ left: 10_000 });
    await wait(100);
    await expect.element(screen.getByRole("grid")).toMatchScreenshot("two_start_one_end_and_scrollable_002");
    grid.scrollBy({ left: -10_000 });
    await wait(100);
    await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
    await wait(100);

    await expect
      .element(screen.getByRole("grid"))
      .toMatchScreenshot("two_start_one_end_and_scrollable_003-rtl");
    grid.scrollBy({ left: -10_000 });
    await wait(100);
    await expect
      .element(screen.getByRole("grid"))
      .toMatchScreenshot("two_start_one_end_and_scrollable_004-rtl");
  });

  test("should handle two start, two end, and many scrollable", async () => {
    const screen = await render(<ColumnPinning initial="Two Start, Two End, and Many Scrollable" />);

    await expect.element(screen.getByRole("grid")).toBeVisible();
    await wait(100);

    await expect
      .element(screen.getByRole("grid"))
      .toMatchScreenshot("two_start_two_end_and_many_scrollable_001");
    const grid = screen.getByRole("grid").element();
    grid.scrollBy({ left: 10_000 });
    await wait(100);
    await expect
      .element(screen.getByRole("grid"))
      .toMatchScreenshot("two_start_two_end_and_many_scrollable_002");
    grid.scrollBy({ left: -10_000 });
    await wait(100);
    await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
    await wait(100);

    await expect
      .element(screen.getByRole("grid"))
      .toMatchScreenshot("two_start_two_end_and_many_scrollable_003-rtl");
    grid.scrollBy({ left: -10_000 });
    await wait(100);
    await expect
      .element(screen.getByRole("grid"))
      .toMatchScreenshot("two_start_two_end_and_many_scrollable_004-rtl");
  });

  test("should handle two start (with groups), two end, and scrollable", async () => {
    const screen = await render(<ColumnPinning initial="Two Start (with groups), Two End, and Scrollable" />);

    await expect.element(screen.getByRole("grid")).toBeVisible();
    await wait(100);

    await expect
      .element(screen.getByRole("grid"))
      .toMatchScreenshot("two_start_groups_two_end_and_scrollable_001");
    const grid = screen.getByRole("grid").element();
    grid.scrollBy({ left: 10_000 });
    await wait(100);
    await expect
      .element(screen.getByRole("grid"))
      .toMatchScreenshot("two_start_groups_two_end_and_scrollable_002");
    grid.scrollBy({ left: -10_000 });
    await wait(100);
    await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
    await wait(100);

    await expect
      .element(screen.getByRole("grid"))
      .toMatchScreenshot("two_start_groups_two_end_and_scrollable_003-rtl");
    grid.scrollBy({ left: -10_000 });
    await wait(100);
    await expect
      .element(screen.getByRole("grid"))
      .toMatchScreenshot("two_start_groups_two_end_and_scrollable_004-rtl");
  });

  test("should handle two start, two end (with groups), and scrollable", async () => {
    const screen = await render(<ColumnPinning initial="Two Start, Two End (with groups), and Scrollable" />);

    await expect.element(screen.getByRole("grid")).toBeVisible();
    await wait(100);

    await expect
      .element(screen.getByRole("grid"))
      .toMatchScreenshot("two_start_two_end_groups_and_scrollable_001");
    const grid = screen.getByRole("grid").element();
    grid.scrollBy({ left: 10_000 });
    await wait(100);
    await expect
      .element(screen.getByRole("grid"))
      .toMatchScreenshot("two_start_two_end_groups_and_scrollable_002");
    grid.scrollBy({ left: -10_000 });
    await wait(100);
    await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
    await wait(100);

    await expect
      .element(screen.getByRole("grid"))
      .toMatchScreenshot("two_start_two_end_groups_and_scrollable_003-rtl");
    grid.scrollBy({ left: -10_000 });
    await wait(100);
    await expect
      .element(screen.getByRole("grid"))
      .toMatchScreenshot("two_start_two_end_groups_and_scrollable_004-rtl");
  });

  test("should handle two start, two end, and scrollable (with groups)", async () => {
    const screen = await render(<ColumnPinning initial="Two Start, Two End, and Scrollable (with groups)" />);

    await expect.element(screen.getByRole("grid")).toBeVisible();
    await wait(100);

    await expect
      .element(screen.getByRole("grid"))
      .toMatchScreenshot("two_start_two_end_and_scrollable_groups_001");
    const grid = screen.getByRole("grid").element();
    grid.scrollBy({ left: 10_000 });
    await wait(100);
    await expect
      .element(screen.getByRole("grid"))
      .toMatchScreenshot("two_start_two_end_and_scrollable_groups_002");
    grid.scrollBy({ left: -10_000 });
    await wait(100);
    await userEvent.click(screen.getByText("Toggle RTL: Currently Off"));
    await wait(100);

    await expect
      .element(screen.getByRole("grid"))
      .toMatchScreenshot("two_start_two_end_and_scrollable_groups_003-rtl");
    grid.scrollBy({ left: -10_000 });
    await wait(100);
    await expect
      .element(screen.getByRole("grid"))
      .toMatchScreenshot("two_start_two_end_and_scrollable_groups_004-rtl");
  });
}
