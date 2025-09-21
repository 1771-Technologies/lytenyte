// ------- Your exact types (paste/import from your model) -------
interface UnionDeclaration {
  readonly kind: "union";
  readonly name: string;
  readonly description: string;
  readonly properties: FunctionReturn[];
}

interface PropertyDeclaration {
  readonly kind: "property";
  readonly name: string;
  readonly type: string | ObjectDeclaration | FunctionDeclaration | FunctionReturn[];
  readonly description: string;
}

interface FunctionParameter {
  readonly name: string;
  readonly type: string | ObjectDeclaration | FunctionDeclaration | FunctionReturn[];
  readonly link?: string;
}
interface FunctionReturn {
  readonly type: string | ObjectDeclaration | FunctionDeclaration | FunctionReturn[];
  readonly link?: string;
}

interface FunctionDeclaration {
  readonly kind: "function";
  readonly name: string;
  readonly description: string;
  readonly params: FunctionParameter[];
  readonly return: FunctionReturn;
}

interface ReferenceDeclaration {
  readonly kind: "reference";
  readonly name: string;
  readonly type: string;
  readonly package: string;
  readonly description: string;
  readonly link?: string;
}

interface ObjectDeclaration {
  readonly kind: "object";
  readonly name: string;
  readonly description: string;
  readonly properties: Property[];
}

interface LiteralDeclaration {
  readonly kind: "literal";
  readonly name: string;
  readonly description: string;
  readonly value: string;
}

type Property =
  | PropertyDeclaration
  | ObjectDeclaration
  | ReferenceDeclaration
  | FunctionDeclaration
  | UnionDeclaration
  | LiteralDeclaration;

// ------- Public API -------

/** Renders a single node to nicely formatted MDX. */
export function generateMDX(node: Property): string {
  return renderProperty(node, true).trim() + "\n";
}

// ------- Renderers -------

function renderProperty(node: Property, isRoot?: boolean): string {
  switch (node.kind) {
    case "property":
      return block(
        `<ApiSection ${!isRoot ? `title="${esc(node.name)}"` : ""}  subtitle="property">`,
        isRoot ? `## ${esc(node.name)}` : "",
        mdDesc(node.description),
        h4("Type"),
        inlineCode(renderTypeExpr(node.type, /*preferPlain*/ true)),
        `</ApiSection>`,
      );

    case "object":
      return block(
        `<ApiSection ${!isRoot ? `title="${esc(node.name)}"` : ""}  subtitle="property">`,
        isRoot ? `## ${esc(node.name)}` : "",
        mdDesc(node.description),
        node.properties.length
          ? node.properties.map((c) => renderProperty(c)).join("\n\n")
          : "_No properties_",
        `</ApiSection>`,
      );

    case "reference": {
      const typeCell = node.link
        ? `<TypeLink href="${escAttr(node.link)}">${esc(node.type)}</TypeLink>`
        : inlineCode(esc(node.type));
      return block(
        `<ApiSection ${!isRoot ? `title="${esc(node.name)}"` : ""}  subtitle="property">`,
        isRoot ? `## ${esc(node.name)}` : "",
        mdDesc(node.description),
        `<KVTable>`,
        row("Type", typeCell),
        `</KVTable>`,
        `</ApiSection>`,
      );
    }

    case "function": {
      const params =
        node.params.length === 0
          ? `_This function takes no parameters._`
          : block(
              `<KVTable>`,
              node.params
                .map((p) =>
                  row(
                    inlineCode(escIdent(p.name)),
                    // show type as code; add a trailing docs note if link exists and would be lost
                    inlineCode(renderTypeExpr(p.type, /*preferPlain*/ true)) +
                      (p.link ? ` ${smallDocs(p.link)}` : ""),
                  ),
                )
                .join("\n"),
              `</KVTable>`,
            );

      const retCode = inlineCode(renderTypeExpr(node.return.type, /*preferPlain*/ true));
      const retDocs = node.return.link ? ` ${smallDocs(node.return.link)}` : "";

      return block(
        `<ApiSection ${!isRoot ? `title="${esc(node.name)}"` : ""}  subtitle="property">`,
        isRoot ? `## ${esc(node.name)}` : "",
        mdDesc(node.description),
        h4("Parameters"),
        params,
        h4("Returns"),
        `${retCode}${retDocs}`,
        `</ApiSection>`,
      );
    }

    case "union": {
      const variants = node.properties;
      const compact = variants.length
        ? variants.map((v) => renderTypeExpr(v.type, /*preferPlain*/ true)).join(" | ")
        : "never";

      const list =
        variants.length === 0
          ? `_No union members defined._`
          : variants
              .map(
                (v) =>
                  `- ${inlineCode(renderTypeExpr(v.type, /*preferPlain*/ true))}${renderOptionalLinkNote(v)}`,
              )
              .join("\n");

      return block(
        `<ApiSection ${!isRoot ? `title="${esc(node.name)}"` : ""}  subtitle="property">`,
        isRoot ? `## ${esc(node.name)}` : "",
        mdDesc(node.description),
        h4("Type"),
        inlineCode(compact),
        h4("Variants"),
        list,
        `</ApiSection>`,
      );
    }

    case "literal":
      return block(
        `<ApiSection ${!isRoot ? `title="${esc(node.name)}"` : ""}  subtitle="property">`,
        isRoot ? `## ${esc(node.name)}` : "",
        mdDesc(node.description),
        h4("Value"),
        inlineCode(esc(JSON.stringify(node.value))),
        `</ApiSection>`,
      );

    default: {
      const _exhaustive: never = node;
      return "";
    }
  }
}

// ------- Recursive type-expression renderer -------

/**
 * Render a recursive type expression according to your schema.
 * If `preferPlain` is true, links are NOT inlined into the code span;
 * instead we emit a trailing small docs link where appropriate.
 */
export function renderTypeExpr(
  t: string | ObjectDeclaration | FunctionDeclaration | FunctionReturn[],
  _ = false,
): string {
  if (typeof t === "string") {
    return esc(t);
  }

  if (Array.isArray(t)) {
    // union expressed as FunctionReturn[]
    return t.length ? t.map((r) => renderTypeExpr(r.type, true)).join(" | ") : "never";
  }

  if (isObjectDeclaration(t)) {
    // If the object's name starts with "__", ignore the name and render the shape only
    const showName = t.name && !t.name.startsWith("__");
    const fields = t.properties
      .map((p) => inlineObjectField(p))
      .filter(Boolean)
      .join("; ");

    const body = `{ ${fields} }`;
    return showName ? `${esc(t.name)} ${body}` : body;
  }

  if (isFunctionDeclaration(t)) {
    // functions already render as a bare signature; the name is not used here
    const params = t.params
      .map((p) => `${escIdent(p.name)}: ${renderTypeExpr(p.type, true)}`)
      .join(", ");
    const returns = renderTypeExpr(t.return.type, true);
    return `(${params}) => ${returns}`;
  }

  return "";
}

// Inline object field rendering (for object type literals)
function inlineObjectField(prop: Property): string {
  switch (prop.kind) {
    case "property": {
      const t = renderTypeExpr(prop.type, true);
      return `${escIdent(prop.name)}: ${t}`;
    }
    case "literal": {
      return `${escIdent(prop.name)}: ${esc(JSON.stringify(prop.value))}`;
    }
    case "reference": {
      // keep simple inline reference as plain type text
      return `${escIdent(prop.name)}: ${prop.type}`;
    }
    case "function": {
      const sig = renderTypeExpr(prop, true); // function as type
      return `${escIdent(prop.name)}: ${sig}`;
    }
    case "union": {
      const compact = prop.properties.length
        ? prop.properties.map((r) => renderTypeExpr(r.type, true)).join(" | ")
        : "never";
      return `${escIdent(prop.name)}: ${compact}`;
    }
    case "object": {
      const nested = renderTypeExpr(prop, true);
      return `${escIdent(prop.name)}: ${nested}`;
    }
    default: {
      const _x: never = prop;
      return "";
    }
  }
}

// ------- Small helpers & formatting -------

function renderOptionalLinkNote(ret: FunctionReturn): string {
  if (!ret.link) return "";
  // For inline types rendered with backticks, we can’t include <a> inside the code span.
  // Add a small trailing docs link.
  // Even for string types, we keep links out of code spans for consistency.
  return ` ${smallDocs(ret.link)}`;
}

function smallDocs(href: string): string {
  return `(<TypeLink href="${escAttr(href)}">docs</TypeLink>)`;
}

function row(key: string, value: string): string {
  return `<tr><td><strong>${esc(key)}</strong></td><td>${value}</td></tr>`;
}

function h4(text: string): string {
  return `<H4>${esc(text)}</H4>`;
}

function mdDesc(text: string): string {
  const trimmed = text?.trim();
  return trimmed ? trimmed : "_No description_";
}

function block(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join("\n\n");
}

function inlineCode(s: string): string {
  return "`" + escapeBackticks(s) + "`";
}

function escapeBackticks(s: string): string {
  // Replace raw backticks so inline code stays valid
  return String(s).replace(/`/g, "&#96;");
}

function esc(s: string): string {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escAttr(s: string): string {
  return esc(s).replace(/"/g, "&quot;");
}

function escIdent(s: string): string {
  return s;
}

// ------- Type guards -------

function isObjectDeclaration(t: any): t is ObjectDeclaration {
  return t && typeof t === "object" && t.kind === "object";
}
function isFunctionDeclaration(t: any): t is FunctionDeclaration {
  return t && typeof t === "object" && t.kind === "function";
}
