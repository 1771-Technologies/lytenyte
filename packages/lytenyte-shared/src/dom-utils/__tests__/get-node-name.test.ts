import { describe, expect, test, vi } from "vitest";
import { getNodeName } from "../get-node-name.js";

describe("getNodeName", () => {
  test("when the node has a name it should be returned", () => {
    expect(getNodeName(document.createElement("div"))).toEqual("div");
  });

  test("when the node does not have a local name an empty string should be returned", () => {
    const el = document.createElement("div");
    vi.spyOn(el, "localName", "get").mockImplementation(() => null as unknown as string);
    expect(getNodeName(el)).toEqual("");
  });

  test("when the value passed in is not an HTML element it should return #document", () => {
    expect(getNodeName(window)).toEqual("#document");
  });
});
