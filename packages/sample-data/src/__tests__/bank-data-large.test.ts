import { test, expect } from "@1771technologies/aio/vitest";
import { bankDataLarge } from "../bank-data-large";

test("bank data large test", () => {
  const row = bankDataLarge[0];
  expect(row).toMatchInlineSnapshot(`
    {
      "age": 58,
      "balance": 2143,
      "campaign": "1",
      "contact": "unknown",
      "day": 5,
      "default": "no",
      "duration": 261,
      "education": "tertiary",
      "housing": "yes",
      "job": "management",
      "loan": "no",
      "marital": "married",
      "month": "may",
      "pdays": "-1",
      "poutcome": "unknown",
      "previous": "0",
      "y": "no",
    }
  `);
});
