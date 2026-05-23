import type { XmlElement } from "./types.js";
import { unescapeXml } from "../unescape-xml.js";

/**
 * Parses a raw XML string into an `XmlElement` tree using a lightweight,
 * hand-written streaming parser.
 *
 * This parser exists instead of relying on `DOMParser` or a third-party
 * library for two reasons: it works identically in all JavaScript runtimes
 * (browser, Node, Deno, Bun) without polyfills, and it is optimized for the
 * subset of XML that appears in OOXML packages -- no DTD validation, no
 * namespace URI resolution, and minimal memory allocation.
 *
 * The function skips XML prologs (`<?xml ... ?>`) and DOCTYPE declarations
 * before parsing the root element. CDATA sections are captured as text
 * content, and XML comments are ignored. Attribute values and text nodes are
 * automatically unescaped via `unescapeXml`. Throws if no root element is
 * found.
 */
export function parseXml(xml: string): XmlElement {
  const parser = new XmlWalker(xml);

  parser.skipProlog();

  const root = parser.parseElement();
  if (!root) {
    throw new Error("No root element found in XML");
  }

  return root;
}

class XmlWalker {
  #xml: string;
  #pos: number;
  #len: number;

  constructor(xml: string) {
    this.#xml = xml;
    this.#pos = 0;
    this.#len = xml.length;
  }

  skipProlog(): void {
    this.#skipWhitespace();

    while (this.#pos < this.#len && this.#xml[this.#pos] === "<" && this.#xml[this.#pos + 1] === "?") {
      const end = this.#xml.indexOf("?>", this.#pos);
      if (end === -1) break;

      this.#pos = end + 2;
      this.#skipWhitespace();
    }

    while (this.#pos < this.#len && this.#xml.startsWith("<!DOCTYPE", this.#pos)) {
      const end = this.#xml.indexOf(">", this.#pos);
      if (end === -1) break;

      this.#pos = end + 1;
      this.#skipWhitespace();
    }

    this.#skipComments();
  }

  parseElement(): XmlElement | null {
    this.#skipWhitespace();
    this.#skipComments();

    if (this.#pos >= this.#len || this.#xml[this.#pos] !== "<" || this.#xml[this.#pos + 1] === "/")
      return null;

    this.#pos++;

    const fullTag = this.#readName();
    const [ns, tag] = splitNs(fullTag);
    const attrs = this.#readAttributes();

    this.#skipWhitespace();

    if (this.#xml[this.#pos] === "/" && this.#xml[this.#pos + 1] === ">") {
      this.#pos += 2;
      return { tag, ns: ns || undefined, attrs, children: [], text: undefined };
    }

    if (this.#xml[this.#pos] === ">") this.#pos++;

    const children: XmlElement[] = [];
    let text = "";

    while (this.#pos < this.#len) {
      if (this.#xml.startsWith("<![CDATA[", this.#pos)) {
        const cdataEnd = this.#xml.indexOf("]]>", this.#pos + 9);

        if (cdataEnd !== -1) {
          text += this.#xml.slice(this.#pos + 9, cdataEnd);
          this.#pos = cdataEnd + 3;

          continue;
        }
      }

      if (this.#xml.startsWith("<!--", this.#pos)) {
        const commentEnd = this.#xml.indexOf("-->", this.#pos + 4);

        if (commentEnd !== -1) {
          this.#pos = commentEnd + 3;
          continue;
        }
      }

      if (this.#xml[this.#pos] === "<" && this.#xml[this.#pos + 1] === "/") {
        const closeEnd = this.#xml.indexOf(">", this.#pos);
        if (closeEnd !== -1) this.#pos = closeEnd + 1;

        break;
      }

      if (this.#xml[this.#pos] === "<") {
        const child = this.parseElement();

        if (child) {
          children.push(child);
          continue;
        }

        break;
      }

      const textEnd = this.#xml.indexOf("<", this.#pos);

      if (textEnd === -1) {
        text += this.#xml.slice(this.#pos);
        this.#pos = this.#len;
      } else {
        text += this.#xml.slice(this.#pos, textEnd);
        this.#pos = textEnd;
      }
    }

    const trimmedText = text.trim();

    return {
      tag,
      ns: ns || undefined,
      attrs,
      children,
      text: trimmedText ? unescapeXml(trimmedText) : undefined,
    };
  }

  #readName(): string {
    const start = this.#pos;

    while (this.#pos < this.#len) {
      const ch = this.#xml[this.#pos];

      if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r" || ch === ">" || ch === "/" || ch === "=")
        break;

      this.#pos++;
    }

    return this.#xml.slice(start, this.#pos);
  }

  #readAttributes(): Record<string, string> {
    const attrs: Record<string, string> = {};

    while (this.#pos < this.#len) {
      this.#skipWhitespace();

      const ch = this.#xml[this.#pos];
      if (ch === ">" || ch === "/" || this.#pos >= this.#len) break;

      const name = this.#readName();
      if (!name) break;

      this.#skipWhitespace();

      if (this.#xml[this.#pos] !== "=") {
        attrs[name] = "";
        continue;
      }

      this.#pos++;
      this.#skipWhitespace();

      const quote = this.#xml[this.#pos];
      if (quote !== '"' && quote !== "'") break;

      this.#pos++;
      const valueStart = this.#pos;

      while (this.#pos < this.#len && this.#xml[this.#pos] !== quote) this.#pos++;

      const value = this.#xml.slice(valueStart, this.#pos);
      this.#pos++;

      attrs[name] = unescapeXml(value);
    }
    return attrs;
  }

  #skipWhitespace(): void {
    while (this.#pos < this.#len) {
      const ch = this.#xml[this.#pos];

      if (ch !== " " && ch !== "\t" && ch !== "\n" && ch !== "\r") break;

      this.#pos++;
    }
  }

  #skipComments(): void {
    while (this.#pos < this.#len && this.#xml.startsWith("<!--", this.#pos)) {
      const end = this.#xml.indexOf("-->", this.#pos + 4);

      if (end === -1) break;

      this.#pos = end + 3;
      this.#skipWhitespace();
    }
  }
}

function splitNs(fullName: string): [string, string] {
  const colon = fullName.indexOf(":");

  if (colon === -1) return ["", fullName];

  return [fullName.slice(0, colon), fullName.slice(colon + 1)];
}
