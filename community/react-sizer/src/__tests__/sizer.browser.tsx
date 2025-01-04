import { useState } from "react";
import { Sizer } from "../sizer";
import { render } from "@1771technologies/aio/browser";

test("Should size up and down", async () => {
  function X() {
    const [size, setSet] = useState(40);

    return (
      <div>
        <button onClick={() => setSet((prev) => prev + 10)}>Up</button>
        <button onClick={() => setSet((prev) => prev - 10)}>Down</button>

        <div style={{ width: size, height: size }}>
          <Sizer>
            <div style={{ width: "100%", height: "100%" }}>Find Me</div>
          </Sizer>
        </div>
      </div>
    );
  }

  const screen = render(<X />);

  const container = screen.getByText("Find Me");
  const c = container.element();

  expect(c.clientWidth).toEqual(40);
  expect(c.clientHeight).toEqual(40);

  await screen.getByText("Up").click();

  await vi.waitFor(() => expect(c.clientWidth).toEqual(50));
  await vi.waitFor(() => expect(c.clientHeight).toEqual(50));

  await screen.getByText("Down").click();
  await vi.waitFor(() => expect(c.clientWidth).toEqual(40));
  await vi.waitFor(() => expect(c.clientHeight).toEqual(40));
});

test("Should report the correct sizing", async () => {
  const r: any = {};
  function X() {
    const [size, setSet] = useState(40);

    return (
      <div>
        <button onClick={() => setSet((prev) => prev + 10)}>Up</button>
        <button onClick={() => setSet((prev) => prev - 10)}>Down</button>

        <div style={{ width: size, height: size }}>
          <Sizer
            onSizeChange={(size) => (r.current = size)}
            onInit={(_, s) => {
              r.current = s;
            }}
          >
            <div style={{ width: "100%", height: "100%" }}>Find Me</div>
          </Sizer>
        </div>
      </div>
    );
  }

  const screen = render(<X />);

  const container = screen.getByText("Find Me");
  const c = container.element();

  expect(r.current).toMatchInlineSnapshot(`
    {
      "innerHeight": 40,
      "innerWidth": 40,
      "outerHeight": 40,
      "outerWidth": 40,
    }
  `);

  expect(c.clientWidth).toEqual(40);
  expect(c.clientHeight).toEqual(40);

  await screen.getByText("Up").click();

  await vi.waitFor(() => expect(c.clientWidth).toEqual(50));
  await vi.waitFor(() => expect(c.clientHeight).toEqual(50));

  expect(r.current).toMatchInlineSnapshot(`
    {
      "innerHeight": 50,
      "innerWidth": 50,
      "outerHeight": 50,
      "outerWidth": 50,
    }
  `);

  await screen.getByText("Down").click();
  await vi.waitFor(() => expect(c.clientWidth).toEqual(40));
  await vi.waitFor(() => expect(c.clientHeight).toEqual(40));
});
