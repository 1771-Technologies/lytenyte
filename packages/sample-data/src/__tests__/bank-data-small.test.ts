import { test, expect } from "@1771technologies/aio/vitest";
import { bankDataSmall } from "../bank-data-small";

test("bank data small test", () => {
  const row = bankDataSmall[0];
  expect(row).toMatchInlineSnapshot(`
    {
      "age": 30,
      "balance": 1787,
      "campaign": "1",
      "contact": "cellular",
      "day": 19,
      "default": "no",
      "duration": 79,
      "education": "primary",
      "housing": "no",
      "job": "unemployed",
      "loan": "no",
      "marital": "married",
      "month": "oct",
      "pdays": "-1",
      "poutcome": "unknown",
      "previous": "0",
      "y": "no",
    }
  `);
});
