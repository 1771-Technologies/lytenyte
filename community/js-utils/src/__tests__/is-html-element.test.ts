import { isHTMLElement } from "../is-html-element.js";

test("should return false for null or undefined", () => {
  expect(isHTMLElement(null)).toBe(false);
  expect(isHTMLElement(undefined)).toBe(false);
});

test("should return true for regular HTML elements", () => {
  const div = document.createElement("div");
  const span = document.createElement("span");
  const input = document.createElement("input");

  expect(isHTMLElement(div)).toBe(true);
  expect(isHTMLElement(span)).toBe(true);
  expect(isHTMLElement(input)).toBe(true);
});

test("should return false for non-HTML elements", () => {
  expect(isHTMLElement({})).toBe(false);
  expect(isHTMLElement([])).toBe(false);
  expect(isHTMLElement("string")).toBe(false);
  expect(isHTMLElement(42)).toBe(false);
  expect(isHTMLElement(true)).toBe(false);
});

test("should return true for iframe HTML elements", () => {
  const iframe = document.createElement("iframe");
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument!;
  const iframeDiv = iframeDoc.createElement("div");

  expect(isHTMLElement(iframeDiv)).toBe(true);

  document.body.removeChild(iframe);
});

test("should return false for SVG elements", () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

  expect(isHTMLElement(svg)).toBe(false);
  expect(isHTMLElement(circle)).toBe(false);
});

test("should handle objects with ownerDocument but no defaultView", () => {
  const fakeElement = {
    ownerDocument: {},
  };

  expect(isHTMLElement(fakeElement)).toBe(false);
});
