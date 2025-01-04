import { render } from "@1771technologies/aio/browser";
import { Virt } from "../virt";

test("should render with no elements", async () => {
  function X() {
    return (
      <div style={{ width: 100, height: 200 }}>
        <Virt data={[]} itemHeight={10} renderer={() => <></>} data-testid="x" />
      </div>
    );
  }

  const screen = render(<X />);

  const el = screen.getByTestId("x");

  await expect.element(el).toHaveTextContent("");
});

test("should render only the visible elements", async () => {
  function X() {
    return (
      <div style={{ width: 100, height: 200 }}>
        <Virt
          data={Array.from({ length: 200 }, (_, i) => i)}
          itemHeight={10}
          renderer={(p) => <div>{p.rowIndex}</div>}
          data-testid="x"
        />
      </div>
    );
  }

  const screen = render(<X />);

  const el = screen.getByTestId("x");

  const element = el.element();

  expect(element.textContent).toMatchInlineSnapshot(`"0123456789101112131415161718192021222324"`);
});

test("should render only the visible elements with prevent flash", async () => {
  function X() {
    return (
      <div style={{ width: 100, height: 200 }}>
        <Virt
          data={Array.from({ length: 200 }, (_, i) => i)}
          itemHeight={10}
          renderer={(p) => <div>{p.rowIndex}</div>}
          preventFlash
          data-testid="x"
        />
      </div>
    );
  }

  const screen = render(<X />);

  const el = screen.getByTestId("x");

  const element = el.element();

  expect(element.textContent).toMatchInlineSnapshot(`"0123456789101112131415161718192021222324"`);
});

test("should render only the visible elements with focus index before", async () => {
  function X() {
    return (
      <div style={{ width: 100, height: 200 }}>
        <Virt
          data={Array.from({ length: 200 }, (_, i) => i)}
          itemHeight={10}
          renderer={(p) => <div>{p.rowIndex}</div>}
          preventFlash
          focusedIndex={0}
          data-testid="x"
        />
      </div>
    );
  }

  const screen = render(<X />);

  const el = screen.getByTestId("x");
  el.element().scrollTo({ top: 200 });

  const v = screen.getByText("40");
  await expect.element(v).toBeVisible();
  const element = el.element();

  expect(element.textContent).toMatchInlineSnapshot(
    `"0151617181920212223242526272829303132333435363738394041424344"`,
  );
});

test("should render only the visible elements with focus index after", async () => {
  function X() {
    return (
      <div style={{ width: 100, height: 200 }}>
        <Virt
          data={Array.from({ length: 200 }, (_, i) => i)}
          itemHeight={10}
          renderer={(p) => <div>{p.rowIndex}</div>}
          preventFlash
          focusedIndex={38}
          data-testid="x"
        />
      </div>
    );
  }

  const screen = render(<X />);

  const el = screen.getByTestId("x");

  const element = el.element();

  expect(element.textContent).toMatchInlineSnapshot(`"012345678910111213141516171819202122232438"`);
});
