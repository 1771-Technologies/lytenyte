import { describe, expect, test } from "vitest";
import { isDetailsWithSummary } from "../is-detail-with-summary.js";

describe("isDetailWithSummary", () => {
  test("should return the correct result", () => {
    const detail = document.createElement("details");
    expect(isDetailsWithSummary(detail)).toEqual(false);

    const summary = document.createElement("summary");
    detail.appendChild(summary);

    expect(isDetailsWithSummary(detail)).toEqual(true);

    const notDetail = document.createElement("div");
    expect(isDetailsWithSummary(notDetail)).toEqual(false);
  });
});
