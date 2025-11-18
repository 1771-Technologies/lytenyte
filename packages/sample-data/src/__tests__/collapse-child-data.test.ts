import { test, expect } from "@1771technologies/aio/vitest";
import { collapseChildData } from "../collapse-child-data";

test("collapse child data test", () => {
  const row = collapseChildData[0];
  expect(row).toMatchInlineSnapshot(`
    {
      "athlete": "Fabio",
      "bronze": 10,
      "city": "Paris",
      "country": "France",
      "gold": 10,
      "silver": 10,
      "year": "2016",
    }
  `);
});
