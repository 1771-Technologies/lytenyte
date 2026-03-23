import { describe, expect, test } from "vitest";
import { startSection, endSection, bottomSection, topSection, centerSection } from "./section-mappings.js";

describe("section-mappings", () => {
  test("Should contain all start-column sections", () => {
    expect(startSection["top-start"]).toBe(true);
    expect(startSection["center-start"]).toBe(true);
    expect(startSection["bottom-start"]).toBe(true);
  });

  test("Should not contain non-start sections", () => {
    expect(startSection["top-center"]).toBeFalsy();
    expect(startSection["top-end"]).toBeFalsy();
    expect(startSection["center-center"]).toBeFalsy();
    expect(startSection["center-end"]).toBeFalsy();
    expect(startSection["bottom-center"]).toBeFalsy();
    expect(startSection["bottom-end"]).toBeFalsy();
  });

  test("Should contain all end-column sections", () => {
    expect(endSection["top-end"]).toBe(true);
    expect(endSection["center-end"]).toBe(true);
    expect(endSection["bottom-end"]).toBe(true);
  });

  test("Should not contain non-end sections", () => {
    expect(endSection["top-start"]).toBeFalsy();
    expect(endSection["top-center"]).toBeFalsy();
    expect(endSection["center-start"]).toBeFalsy();
    expect(endSection["center-center"]).toBeFalsy();
    expect(endSection["bottom-start"]).toBeFalsy();
    expect(endSection["bottom-center"]).toBeFalsy();
  });

  test("Should contain all top-row sections", () => {
    expect(topSection["top-start"]).toBe(true);
    expect(topSection["top-center"]).toBe(true);
    expect(topSection["top-end"]).toBe(true);
  });

  test("Should not contain non-top sections", () => {
    expect(topSection["center-start"]).toBeFalsy();
    expect(topSection["center-center"]).toBeFalsy();
    expect(topSection["center-end"]).toBeFalsy();
    expect(topSection["bottom-start"]).toBeFalsy();
    expect(topSection["bottom-center"]).toBeFalsy();
    expect(topSection["bottom-end"]).toBeFalsy();
  });

  test("Should contain all bottom-row sections", () => {
    expect(bottomSection["bottom-start"]).toBe(true);
    expect(bottomSection["bottom-center"]).toBe(true);
    expect(bottomSection["bottom-end"]).toBe(true);
  });

  test("Should not contain non-bottom sections", () => {
    expect(bottomSection["top-start"]).toBeFalsy();
    expect(bottomSection["top-center"]).toBeFalsy();
    expect(bottomSection["top-end"]).toBeFalsy();
    expect(bottomSection["center-start"]).toBeFalsy();
    expect(bottomSection["center-center"]).toBeFalsy();
    expect(bottomSection["center-end"]).toBeFalsy();
  });

  test("Should contain all center-row sections", () => {
    expect(centerSection["center-start"]).toBe(true);
    expect(centerSection["center-center"]).toBe(true);
    expect(centerSection["center-end"]).toBe(true);
  });

  test("Should not contain non-center sections", () => {
    expect(centerSection["top-start"]).toBeFalsy();
    expect(centerSection["top-center"]).toBeFalsy();
    expect(centerSection["top-end"]).toBeFalsy();
    expect(centerSection["bottom-start"]).toBeFalsy();
    expect(centerSection["bottom-center"]).toBeFalsy();
    expect(centerSection["bottom-end"]).toBeFalsy();
  });
});
