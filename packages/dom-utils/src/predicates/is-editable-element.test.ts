import { describe, expect, test, vi } from "vitest";
import { isEditableElement } from "./is-editable-element.js";

describe("isEditableElement", () => {
  test("Should return false when the element is not an HTML element or is null", () => {
    expect(isEditableElement(null)).toEqual(false);
    expect(isEditableElement({} as any)).toEqual(false);
  });

  test("Should return true when the element is an input element", () => {
    const el = document.createElement("input");
    document.body.appendChild(el);

    expect(isEditableElement(el)).toEqual(true);
  });

  test("Should return false when the element is an input but selectionStart is null", () => {
    const el = document.createElement("input");
    vi.spyOn(el, "selectionStart", "get").mockImplementation(() => null as any);

    expect(isEditableElement(el)).toEqual(false);
  });

  test("Should return true when the element has contenteditable set", () => {
    const el = document.createElement("div");
    vi.spyOn(el, "isContentEditable", "get").mockImplementation(() => true);
    expect(isEditableElement(el)).toEqual(true);
    vi.spyOn(el, "isContentEditable", "get").mockImplementation(() => false);
    expect(isEditableElement(el)).toEqual(false);

    const viaAttribute = document.createElement("div");
    viaAttribute.setAttribute("contenteditable", "true");
    expect(isEditableElement(viaAttribute)).toEqual(true);
    viaAttribute.setAttribute("contenteditable", "");
    expect(isEditableElement(viaAttribute)).toEqual(true);
    viaAttribute.setAttribute("contenteditable", "false");
    expect(isEditableElement(viaAttribute)).toEqual(false);
  });
});
