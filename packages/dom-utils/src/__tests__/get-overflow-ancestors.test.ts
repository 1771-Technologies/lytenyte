import { describe, test } from "vitest";
import { getOverflowAncestors } from "../get-overflow-ancestors.js";

describe("getOverflowAncestors", () => {
  test("smoke test", () => {
    getOverflowAncestors(document.createElement("div"));
  });
});
