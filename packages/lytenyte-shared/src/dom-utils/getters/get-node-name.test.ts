import { describe, expect, test, vi } from "vitest";
import { getNodeName } from "./get-node-name.js";

describe("getNodeName", () => {
  test("Should return the local name of an HTML element", () => {
    expect(getNodeName(document.createElement("div"))).toEqual("div");
  });

  test("Should return an empty string when localName is null", () => {
    const el = document.createElement("div");
    vi.spyOn(el, "localName", "get").mockImplementation(() => null as unknown as string);
    expect(getNodeName(el)).toEqual("");
  });

  test("Should return #document when the value is not an HTML element", () => {
    expect(getNodeName(window)).toEqual("#document");
  });
});
