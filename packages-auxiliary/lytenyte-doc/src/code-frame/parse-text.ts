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
  if (lines[0]?.startsWith("//!")) {
    const line = lines.shift()!;
    attrs = Object.fromEntries(
      line
        .split(" ")
        .map((x) => x.trim())
        .map((x) => {
          const [prop, value] = x.split("=");
          if (!value) return [prop.trim(), true];
          return [prop.trim(), value.trim()];
        }),
    );

    // Handle global directives;
  }

  const collapses: string[] = [];
  const indicesToRemove: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("//# start")) {
      const start = i + 1;

      while (i < lines.length && !lines[i].trim().startsWith("//# end")) i++;
      const end = i - 1;

      collapses.push(`${start}-${end}`);

      indicesToRemove.push(start);
      if (i !== lines.length) indicesToRemove.push(end);
    }
  }

  lines = lines.filter((_, i) => !indicesToRemove.includes(i));

  const parsedLines = lines.map((x, i) => {
    // There is no directive on this line, so we can just skip it
    if (!x.includes("//!")) return x;

    const [line, directive] = x.split("//!");

    // parse the directive
    const parsed = parseDirective(directive);
    if (!parsed) return line;

    if (parsed.type === "ins") {
      ins.push({
        range: `${i}-${i + parsed.span - 1}`,
        label: parsed.label,
      });
    }
    if (parsed.type === "del") {
      del.push({
        range: `${i}-${i + parsed.span - 1}`,
        label: parsed.label,
      });
    }
    if (parsed.type === "mark") {
      mark.push({
        range: `${i}-${i + parsed.span - 1}`,
        label: parsed.label,
      });
    }

    return line;
  });

  return {
    code: parsedLines.join("\n"),
    del,
    ins,
    mark,
    collapse: collapses,
    showLineNumbers: true,
    ...attrs,
  };
}

type DirectiveType = "mark" | "del" | "ins";

interface Directive {
  type: DirectiveType;
  span: number;
  label?: string;
}

export function parseDirective(directiveText: string): Directive | null {
  let text = directiveText.trim();

  const type = text.startsWith("ins=") ? "ins" : text.startsWith("del=") ? "del" : "mark";
  if (type === "ins") text = text.replace("ins=", "").trim();
  if (type === "del") text = text.replace("del=", "").trim();

  // At this point we expect the text to be in braces.
  const hasLabel = text.startsWith("'") || text.startsWith('"');
  if (!hasLabel) {
    return {
      type,
      span: Number.parseInt(text),
    };
  }

  const quote = text.startsWith("'") ? "'" : '"';

  let consumed = 1;
  while (consumed < text.length && text[consumed] !== quote) consumed++;

  const label = text.slice(1, consumed);

  const remaining = text.slice(consumed + 1).trim();
  return {
    span: Number.parseInt(remaining),
    label,
    type,
  };
}
