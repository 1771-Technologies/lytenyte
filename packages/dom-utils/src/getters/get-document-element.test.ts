import { describe, expect, test } from "vitest";
import { getDocumentElement } from "./get-document-element.js";
import { wait } from "@1771technologies/js-utils";

describe("getDocumentElement", () => {
  test("Should return the document element for the given node", async () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    await wait();
    expect(getDocumentElement(el)).toBe(document.documentElement);
  });
});
