import { memo, useEffect, useMemo, useRef } from "react";
import { makeRowStore } from "../make-row-store";
import type { AtomReadonly } from "../../signal/react/make-atom";

const rowData: Record<number, number> = {};
const rowStore = makeRowStore({
  getRow: (i) => {
    if (rowData[i] != null) return rowData[i];

    rowData[i] = 0;
    return 0;
  },
});
rowStore.count.set(10);

export default function RowStoreDemo({ runner }: { runner?: () => void }) {
  // For tests
  runner?.();

  useEffect(() => {}, []);

  const rc = rowStore.count.useValue();

  const rows = useMemo(() => {
    return Array.from({ length: rc }, (_, i) => i);
  }, [rc]);

  return (
    <div>
      <div>
        <button onClick={() => rowStore.invalidate()}>Invalidate All</button>
      </div>
      <div>
        <button onClick={() => rowStore.count.set((prev) => prev + 1)}>Add Row</button>
        <button onClick={() => rowStore.count.set((prev) => prev - 1)}>Remove Row</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", paddingTop: 8 }}>
        {rows.map((c) => {
          return <Row key={c} row={rowStore.row(c)} index={c} />;
        })}
      </div>
    </div>
  );
}

function RowImpl({ row, index }: { row: AtomReadonly<number>; index: number }) {
  const v = row.useValue();
  const rendered = useRef(0);
  rendered.current++;

  return (
    <div
      data-testid={index}
      style={{ display: "grid", gridTemplateColumns: "120px 80px auto", gap: 8 }}
    >
      <div data-testid={`content-${index}`}>
        Row: {index} Value: {v}
      </div>
      <div>
        <button
          data-testid={`add-${index}`}
          onClick={() => {
            rowData[index]++;
            rowStore.invalidate(index);
          }}
        >
          +
        </button>
        <button
          data-testid={`minus-${index}`}
          onClick={() => {
            rowData[index]--;
            rowStore.invalidate(index);
          }}
        >
          -
        </button>
      </div>

      <div data-testid={`render-count-${index}`}>({rendered.current} times)</div>
    </div>
  );
}

const Row = memo(RowImpl);

// if (import.meta.vitest) {
//   const { test, expect, vi } = import.meta.vitest;

//   const { render } = await import("vitest-browser-react");
//   const { userEvent } = await import("@vitest/browser/context");

//   test("rowStore: should correctly handle row count updates", async () => {
//     const screen = render(<RowStoreDemo />);

//     await expect.element(screen.getByTestId("9")).toBeVisible();
//     await expect.element(screen.getByTestId("3")).toBeVisible();
//     await expect.element(screen.getByTestId("0")).toBeVisible();

//     await vi.waitFor(async () => {
//       await expect.element(screen.getByTestId("10")).not.toBeInTheDocument();
//     });

//     await userEvent.click(screen.getByText("Add Row"));
//     await expect.element(screen.getByTestId("10")).toBeVisible();
//     await userEvent.click(screen.getByText("Remove Row"));
//   });

//   test("rowStore: should correct handle the re-renderers", async () => {
//     const fn = vi.fn();
//     const screen = render(<RowStoreDemo runner={fn}></RowStoreDemo>);

//     expect(fn).toHaveBeenCalledOnce();
//     await userEvent.click(screen.getByText("Add Row"));
//     await expect.element(screen.getByTestId("10")).toBeVisible();
//     expect(fn).toHaveBeenCalledTimes(2);
//     await userEvent.click(screen.getByText("Add Row"));
//     await expect.element(screen.getByTestId("11")).toBeVisible();
//     expect(fn).toHaveBeenCalledTimes(3);
//   });

//   test("rowStore: should be able to update the individual items without others rerendering", async () => {
//     const fn = vi.fn();
//     const screen = render(<RowStoreDemo runner={fn} />);

//     expect(fn).toHaveBeenCalledOnce();

//     const renderCount = screen.getByTestId("render-count-0");
//     const otherA = screen.getByTestId("render-count-1");
//     const otherB = screen.getByTestId("render-count-2");

//     const content = screen.getByTestId("content-0");

//     await expect.element(content).toHaveTextContent("Row: 0 Value: 0");
//     await expect.element(renderCount).toHaveTextContent("1 times");
//     await expect.element(otherA).toHaveTextContent("1 times");
//     await expect.element(otherB).toHaveTextContent("1 times");

//     await userEvent.click(screen.getByTestId("minus-0"));
//     await expect.element(content).toHaveTextContent("Row: 0 Value: -1");
//     await expect.element(renderCount).toHaveTextContent("2 times");
//     await expect.element(otherA).toHaveTextContent("1 times");
//     await expect.element(otherB).toHaveTextContent("1 times");

//     await userEvent.click(screen.getByTestId("add-0"));
//     await expect.element(content).toHaveTextContent("Row: 0 Value: 0");
//     await expect.element(renderCount).toHaveTextContent("3 times");
//     await expect.element(otherA).toHaveTextContent("1 times");
//     await expect.element(otherB).toHaveTextContent("1 times");

//     expect(fn).toHaveBeenCalledOnce();

//     await userEvent.click(screen.getByText("Invalidate All"));
//     await expect.element(renderCount).toHaveTextContent("4 times");
//     await expect.element(otherA).toHaveTextContent("2 times");
//     await expect.element(otherB).toHaveTextContent("2 times");
//   });
// }
