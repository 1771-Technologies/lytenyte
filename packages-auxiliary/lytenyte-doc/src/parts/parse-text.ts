import type { MarkerDefinition } from "astro-expressive-code";

export interface ParseProps {
  del: MarkerDefinition[];
  ins: MarkerDefinition[];
  mark: MarkerDefinition[];
  collapses: string[];
}

export function parseExpressiveCode(src: string) {
  let lines = src.split("\n");

  const del: MarkerDefinition[] = [];
  const ins: MarkerDefinition[] = [];
  const mark: MarkerDefinition[] = [];

  let attrs = {};
  if (lines[0]?.startsWith("//!") && !lines[0]?.startsWith("//!next")) {
    const line = lines.shift()!;
    attrs = Object.fromEntries(
      line
        .split(" ")
        .map((x) => x.trim())
        .map((x) => {
          const [prop, value] = x.split("=");
          if (!value) return [prop.trim(), true];

          const v = value.trim() === "false" ? false : value.trim() === "true" ? true : value.trim();
          return [prop.trim(), v];
        }),
    );
  }

  const collapses: { start: number; end: number }[] = [];
  const indicesToRemove: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("//#start") || line.trim().startsWith("{/*#start")) {
      const start = i + 1;

      while (
        i < lines.length &&
        !lines[i].trim().startsWith("//#end") &&
        !lines[i].trim().startsWith("{/*#end")
      )
        i++;
      const end = i - 1;

      collapses.push({ start: start - collapses.length * 2, end: end - collapses.length * 2 });

      indicesToRemove.push(start - 1);
      if (i !== lines.length) indicesToRemove.push(end + 1);
    }
  }

  lines = lines.filter((_, i) => !indicesToRemove.includes(i));

  let deleted = 0;
  const parsedLines = lines
    .map((x, i) => {
      // There is no directive on this line, so we can just skip it
      if (!x.includes("//!") && !x.includes("{/*!")) return x;

      let line: string;
      let directive: string;

      if (x.includes("//!")) {
        [line, directive] = x.split("//!");
      } else {
        [line, directive] = x.replace("*/}", "").split("{/*!");
      }

      // parse the directive
      const parsed = parseDirective(directive);
      if (!parsed) return line;

      const remove = (!line.trim() && !parsed.label?.trim()) || parsed.shouldRemove;

      const n = i - deleted + parsed.offset + (remove ? 0 : 1);
      if (parsed.type === "ins") {
        ins.push({
          range: `${n}-${n + parsed.span - 1}`,
          label: parsed.label,
        });
      }
      if (parsed.type === "del") {
        del.push({
          range: `${n}-${n + parsed.span - 1}`,
          label: parsed.label,
        });
      }
      if (parsed.type === "mark") {
        mark.push({
          range: `${n}-${n + parsed.span - 1}`,
          label: parsed.label,
        });
      }

      if (remove) {
        deleted++;

        collapses.forEach((x) => {
          if (n > x.end) return;
          if (n < x.start) {
            x.start--;
            x.end--;
            return;
          }
          // Must be in between;
          x.end--;
        });

        return null;
      }

      return line;
    })
    .filter((x) => x != null);

  return {
    code: parsedLines.join("\n"),
    del,
    ins,
    mark,
    collapse: collapses.map((x) => `${x.start}-${x.end}`),
    showLineNumbers: true,
    ...attrs,
  };
}

type DirectiveType = "mark" | "del" | "ins";

interface Directive {
  type: DirectiveType;
  span: number;
  label?: string;
  offset: number;
  shouldRemove: boolean;
}

export function parseDirective(directiveText: string): Directive | null {
  let text = directiveText.trim();

  let offset = 0;
  let shouldRemove = false;
  if (text.startsWith("next")) {
    text = text.replace("next", "").trim();
    offset = 1;
    shouldRemove = true;
  }

  if (text.startsWith("prev")) {
    text = text.replace("prev", "").trim();
    offset = 0;
    shouldRemove = true;
  }

  const type = text.startsWith("ins") ? "ins" : text.startsWith("del") ? "del" : "mark";
  if (type === "ins") text = text.replace("ins", "").replace("ins=", "").trim();
  if (type === "del") text = text.replace("del", "").replace("del=", "").trim();

  // At this point we expect the text to be in braces.
  const hasLabel = text.startsWith("'") || text.startsWith('"');
  if (!hasLabel) {
    return {
      type,
      span: text.trim() ? Number.parseInt(text) : 1,
      offset,
      shouldRemove,
    };
  }

  const quote = text.startsWith("'") ? "'" : '"';

  let consumed = 1;
  while (consumed < text.length && text[consumed] !== quote) consumed++;

  const label = text.slice(1, consumed);

  const remaining = text.slice(consumed + 1).trim();
  return {
    span: !remaining ? 1 : Number.parseInt(remaining),
    label,
    type,
    offset,
    shouldRemove,
  };
}
