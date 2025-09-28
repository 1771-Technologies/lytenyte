import { describe, expect, test, vi } from "vitest";
import { isEditableElement } from "../is-editable-element.js";

describe("isEditableElement", () => {
  test("when the element provided is not an HTML element or is null it should return false", () => {
    expect(isEditableElement(null)).toEqual(false);
    expect(isEditableElement({} as any)).toEqual(false);
  });

  test("when the element provided is an input element it should return true", () => {
    const el = document.createElement("input");
    document.body.appendChild(el);

    expect(isEditableElement(el)).toEqual(true);
  });

  test("when the element is an input element but selectionStart is null it should return false", () => {
    const el = document.createElement("input");
    vi.spyOn(el, "selectionStart", "get").mockImplementation(() => null as any);

    expect(isEditableElement(el)).toEqual(false);
  });

  test("when the element has content editable it should return true", () => {
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
