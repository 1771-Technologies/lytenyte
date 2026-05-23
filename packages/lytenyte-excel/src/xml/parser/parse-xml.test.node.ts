import { describe, test, expect } from "vitest";
import { parseXml } from "./parse-xml.js";

describe("parseXml", () => {
  test("Should parse a simple element", () => {
    const root = parseXml("<root/>");

    expect(root.tag).toBe("root");
  });

  test("Should parse a self-closing element with attributes", () => {
    const root = parseXml(`<col min="1" max="3" width="12"/>`);

    expect(root.tag).toBe("col");
    expect(root.attrs["min"]).toBe("1");
    expect(root.attrs["max"]).toBe("3");
    expect(root.attrs["width"]).toBe("12");
    expect(root.children).toHaveLength(0);
  });

  test("Should parse text content", () => {
    const root = parseXml("<v>42</v>");

    expect(root.text).toBe("42");
  });

  test("Should trim whitespace from text content", () => {
    const root = parseXml("<v>  hello  </v>");

    expect(root.text).toBe("hello");
  });

  test("Should unescape XML entities in text content", () => {
    const root = parseXml("<v>A &amp; B</v>");

    expect(root.text).toBe("A & B");
  });

  test("Should unescape XML entities in attribute values", () => {
    const root = parseXml(`<el name="a &amp; b"/>`);

    expect(root.attrs["name"]).toBe("a & b");
  });

  test("Should parse nested children", () => {
    const root = parseXml("<row><c r='A1'/><c r='B1'/></row>");

    expect(root.children).toHaveLength(2);
    expect(root.children[0].tag).toBe("c");
    expect(root.children[0].attrs["r"]).toBe("A1");
    expect(root.children[1].attrs["r"]).toBe("B1");
  });

  test("Should parse deeply nested elements", () => {
    const root = parseXml("<a><b><c>text</c></b></a>");

    expect(root.children[0].children[0].text).toBe("text");
  });

  test("Should strip the XML prologue", () => {
    const root = parseXml(`<?xml version="1.0" encoding="UTF-8"?><root/>`);

    expect(root.tag).toBe("root");
  });

  test("Should ignore XML comments", () => {
    const root = parseXml("<root><!-- a comment --><child/></root>");

    expect(root.children).toHaveLength(1);
    expect(root.children[0].tag).toBe("child");
  });

  test("Should capture CDATA as text content", () => {
    const root = parseXml("<v><![CDATA[<not-a-tag>]]></v>");

    expect(root.text).toBe("<not-a-tag>");
  });

  test("Should extract namespace prefix into ns and local name into tag", () => {
    const root = parseXml(`<x:worksheet xmlns:x="urn:schemas"/>`);

    expect(root.ns).toBe("x");
    expect(root.tag).toBe("worksheet");
  });

  test("Should set ns to undefined for elements without a namespace prefix", () => {
    const root = parseXml("<root/>");

    expect(root.ns).toBeUndefined();
  });

  test("Should throw when no root element is found", () => {
    expect(() => parseXml("")).toThrow();
    expect(() => parseXml("<!-- comment only -->")).toThrow();
  });

  test("Should skip a DOCTYPE declaration before the root element", () => {
    const root = parseXml("<!DOCTYPE root SYSTEM 'foo.dtd'><root/>");

    expect(root.tag).toBe("root");
  });

  test("Should skip a DOCTYPE declaration that follows an XML prologue", () => {
    const root = parseXml(`<?xml version="1.0"?><!DOCTYPE root><root/>`);

    expect(root.tag).toBe("root");
  });

  test("Should capture text that runs to end of string when element has no closing tag", () => {
    const root = parseXml("<v>42");

    expect(root.text).toBe("42");
  });

  test("Should parse a boolean attribute with no value", () => {
    const root = parseXml("<el hidden/>");

    expect(root.attrs["hidden"]).toBe("");
  });

  test("Should parse a boolean attribute alongside valued attributes", () => {
    const root = parseXml(`<el hidden r="1"/>`);
    expect(root.attrs["hidden"]).toBe("");
    expect(root.attrs["r"]).toBe("1");
  });

  test("Should handle an unterminated processing instruction in the prologue", () => {
    const root = parseXml("<?xml no-close <root/>");

    expect(root.tag).toBe("?xml");
  });

  test("Should handle an unterminated DOCTYPE declaration", () => {
    const root = parseXml("<!DOCTYPE foo");

    expect(root.tag).toBe("!DOCTYPE");
  });

  test("Should handle unterminated CDATA inside element content", () => {
    const root = parseXml("<v><![CDATA[no-close</v>");

    expect(root.tag).toBe("v");
  });

  test("Should handle unterminated comment inside element content", () => {
    const root = parseXml("<v><!--no-close</v>");

    expect(root.tag).toBe("v");
  });

  test("Should handle a closing tag with no >", () => {
    const root = parseXml("<root></root");

    expect(root.tag).toBe("root");
  });

  test("Should handle an attribute with no = sign (boolean attribute with leading =)", () => {
    const root = parseXml('<el ="val"/>');

    expect(root.tag).toBe("el");
    expect(root.attrs).toEqual({});
  });

  test("Should handle an unquoted attribute value", () => {
    const root = parseXml("<el r=1/>");

    expect(root.tag).toBe("el");
    expect(root.attrs).toEqual({});
  });
});
