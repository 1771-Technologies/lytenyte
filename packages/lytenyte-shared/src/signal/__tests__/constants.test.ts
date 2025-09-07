import { expect, test } from "vitest";
import { NOOP } from "../+constants.js";

test("Noop should do nothing", () => {
  expect(NOOP()).toMatchInlineSnapshot(`undefined`);
});
