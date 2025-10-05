import { describe, expect, test } from "vitest";
import { getDocumentElement } from "../get-document-element.js";
import { wait } from "../../js-utils/index.js";

describe("getDocumentElement", () => {
  test("should be able to retrieve the document element", async () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    await wait();
    expect(getDocumentElement(el)).toBe(document.documentElement);
  });
});
