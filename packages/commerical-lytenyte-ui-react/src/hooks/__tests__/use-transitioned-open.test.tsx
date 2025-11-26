import { expect, test } from "vitest";
import { useControlled } from "../use-controlled";
import { useRef } from "react";
import { useTransitioned } from "../use-transitioned-open";
import { render } from "vitest-browser-react";
import { userEvent } from "@vitest/browser/context";
import { wait } from "../../utils/wait";

test("the initial state should be idle, and then move states correctly", async () => {
  const Component = () => {
    const [open, setOpen] = useControlled({ controlled: undefined, default: false });
    const elRef = useRef<HTMLDivElement | null>(null);

    const [t, shouldMount] = useTransitioned(open, elRef.current);

    return (
      <>
        <button onClick={() => setOpen((prev) => !prev)}>Toggle</button>
        {shouldMount && (
          <div
            data-state={t}
            ref={elRef}
            style={{
              margin: 8,
              padding: 4,
              background: open ? "red" : "blue",
              width: "fit-content",
              opacity: t === "opening" || t === "closing" ? 0 : 1,
              transition: "opacity 200ms ease-in",
            }}
          >
            <div>State: {t}</div>
            <div>Mounted: {shouldMount ? "Yes" : "No"}</div>
          </div>
        )}
      </>
    );
  };

  const screen = render(<Component />);

  await expect.element(screen.getByRole("button")).toBeVisible();
  await userEvent.click(screen.getByRole("button"));
  await userEvent.click(screen.getByRole("button"));
  await wait();
  await userEvent.click(screen.getByRole("button"));
  await userEvent.click(screen.getByRole("button"));
});

test("when the element provided is not defined it should do nothing", async () => {
  const Component = () => {
    const [open, setOpen] = useControlled({ controlled: undefined, default: false });

    const [t, shouldMount] = useTransitioned(open, null);

    return (
      <>
        <button onClick={() => setOpen((prev) => !prev)}>Toggle</button>
        {shouldMount && (
          <div
            data-state={t}
            style={{
              margin: 8,
              padding: 4,
              background: open ? "red" : "blue",
              width: "fit-content",
              opacity: t === "opening" || t === "closing" ? 0 : 1,
              transition: "opacity 200ms ease-in",
            }}
          >
            <div>State: {t}</div>
            <div>Mounted: {shouldMount ? "Yes" : "No"}</div>
          </div>
        )}
      </>
    );
  };

  const screen = render(<Component />);

  await expect.element(screen.getByRole("button")).toBeVisible();
  await userEvent.click(screen.getByRole("button"));
  await userEvent.click(screen.getByRole("button"));
  await wait();
  await userEvent.click(screen.getByRole("button"));
  await userEvent.click(screen.getByRole("button"));
});
