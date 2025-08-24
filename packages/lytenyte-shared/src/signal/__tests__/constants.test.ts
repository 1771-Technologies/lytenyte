import { expect, test } from "vitest";
import { NOOP } from "../+constants";

test("Noop should do nothing", () => {
  expect(NOOP()).toMatchInlineSnapshot(`undefined`);
});
