import { expect, test, vi } from "vitest";
import { getNavigatorData } from "../get-navigator-data.js";

test("it should return the correct navigator data", () => {
  vi.stubGlobal("navigator", undefined);
  expect(getNavigatorData()).toMatchInlineSnapshot(`
    {
      "maxTouchPoints": -1,
      "platform": "",
    }
  `);

  vi.stubGlobal("navigator", { userAgentData: { platform: "my-platform" }, maxTouchPoints: -2 });
  expect(getNavigatorData()).toMatchInlineSnapshot(`
    {
      "maxTouchPoints": -2,
      "platform": "my-platform",
    }
  `);

  vi.stubGlobal("navigator", { platform: "bob-platform", userAgentData: {} });
  expect(getNavigatorData()).toMatchInlineSnapshot(`
    {
      "maxTouchPoints": -1,
      "platform": "bob-platform",
    }
  `);
  vi.stubGlobal("navigator", { maxTouchPoints: 2 });
  expect(getNavigatorData()).toMatchInlineSnapshot(`
    {
      "maxTouchPoints": 2,
      "platform": "",
    }
  `);
  vi.unstubAllGlobals();
});
