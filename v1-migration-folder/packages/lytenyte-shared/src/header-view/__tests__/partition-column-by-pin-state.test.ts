import { describe, expect, test } from "vitest";
import { partitionColumnsByPinState } from "../partition-columns-by-pin-state.js";

describe("partitionColumnsByPinState", () => {
  test("should return the correct values", () => {
    expect(
      partitionColumnsByPinState([
        { pin: "start" },
        { pin: "end" },
        { pin: "end" },
        {},
        { pin: null },
        { pin: "start" },
      ]),
    ).toMatchInlineSnapshot(`
      {
        "center": [
          {},
          {
            "pin": null,
          },
        ],
        "end": [
          {
            "pin": "end",
          },
          {
            "pin": "end",
          },
        ],
        "start": [
          {
            "pin": "start",
          },
          {
            "pin": "start",
          },
        ],
      }
    `);
  });
});
