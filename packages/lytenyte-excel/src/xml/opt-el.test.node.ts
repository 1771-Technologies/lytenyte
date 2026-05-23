import { describe, test, expect } from "vitest";
import { optEl } from "./opt-el.js";

describe("optEl", () => {
  test("Should produce a self-closing tag when content is undefined", () => {
    expect(optEl("c", { r: "A1" })).toBe(`<c r="A1"/>`);
  });

  test("Should produce a self-closing tag when content is an empty string", () => {
    expect(optEl("c", { r: "A1" }, "")).toBe(`<c r="A1"/>`);
  });

  test("Should produce an open/close tag pair when content is present", () => {
    expect(optEl("c", { r: "A1" }, "<v>42</v>")).toBe(`<c r="A1"><v>42</v></c>`);
  });

  test("Should default to empty attributes", () => {
    expect(optEl("c")).toBe("<c/>");
    expect(optEl("c", {}, "hi")).toBe("<c>hi</c>");
  });
});
