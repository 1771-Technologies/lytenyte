import { readFile } from "fs/promises";
import fs from "fs-extra";
import type { CommentDisplayPart, DeclarationReflection, ReferenceReflection, SomeType } from "typedoc";
import type { JSONOutput } from "typedoc";
import { writeFileSync, rmdirSync } from "fs";
import { renderTypeExpr } from "./mdx-generator.js";

const definition = await readFile("./out.json", "utf-8");

const result = JSON.parse(definition) as JSONOutput.ProjectReflection;

const rootPath = "/docs/reference";

// The items are all references by the root path + group + #
const rootTypes = result.children!;

const rootGroupLookup = new Map<string, string>();
const rootLinkLookup = Object.fromEntries(
  rootTypes.map((c) => {
    const comment = c.comment;
    if (!comment) return [c.name, `${rootPath}/misc#${c.name}`];

    const groupTag = comment.blockTags?.find((x) => x.tag === "@group");

    if (!groupTag) rootGroupLookup.set(c.name, "misc");
    else rootGroupLookup.set(c.name, groupTag.content[0].text);

    if (!groupTag) return [c.name, `${rootPath}/misc#${c.name}`];

    const groupName = groupTag.content[0].text;

    return [c.name, `${rootPath}/${groupName.toLowerCase().replaceAll(" ", "-")}#${c.name}`.toLowerCase()];
  }),
);

interface UnionDeclaration {
  readonly kind: "union";
  readonly name: string;
  readonly description: string;
  readonly properties: FunctionReturn[];
}

interface PropertyDeclaration {
  readonly kind: "property";
  readonly name: string;
  readonly type: string;
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

function resolveDescription(c: CommentDisplayPart[] | undefined) {
  if (!c) return "";

  const text: string[] = [];
  for (let i = 0; i < c.length; i++) {
    const v = c[i];

    if (v.kind === "text") text.push(v.text);
    else if (v.kind === "inline-tag") {
      if (v.tag === "@link") text.push(`[${v.text}](${rootLinkLookup[v.text]})`);
    } else if (v.kind === "code") {
      text.push(`\`${v.text}\``);
    } else if (v.kind === "relative-link") {
      // TODO???
    }
  }

  return text.join(" ");
}

function getProperties(c: DeclarationReflection | ReferenceReflection): Property {
  const name = c.name;
  const description = resolveDescription(c.comment?.summary);

  if (c.type?.type === "literal") {
    return {
      kind: "literal",
      name,
      description,
      value: `${typeof c.type.value === "string" ? `"${c.type.value}"` : c.type.value}`,
    };
  }

  if (c.type?.type === "union") {
    return {
      kind: "union",
      description,
      name,
      properties: c.type.types.map(handleSignatureType),
    };
  }

  // This is a simple declaration, as such
  if (c.type?.type === "intrinsic") {
    return {
      kind: "property",
      name,
      description,
      type: c.type.name,
    } satisfies PropertyDeclaration;
  }

  if (c?.signatures) {
    const rt = c.signatures[0].type;
    const returnType = handleSignatureType(rt as any);

    const x =
      c.signatures[0].parameters?.map((c) => {
        return {
          name: c.name,
          ...handleSignatureType(c as any),
        };
      }) ?? [];

    return {
      kind: "function",
      name,
      description,
      params: x,
      return: returnType,
    };
  }

  // An inline object declaration or function
  if (c.type?.type === "reflection") {
    c = c.type.declaration;
    // This is a function
    if (c.signatures) {
      const rt = c.signatures[0].type;
      const returnType = handleSignatureType(rt as any);

      const x =
        c.signatures[0].parameters?.map((c) => {
          return {
            name: c.name,
            ...handleSignatureType(c.type),
          };
        }) ?? [];

      return {
        kind: "function",
        name,
        description,
        params: x,
        return: returnType,
      };
    }

    const properties = (c.children ?? []).map(getProperties);

    return {
      kind: "object",
      name,
      description,
      properties,
    };
  }

  if (c.type?.type === "reference") {
    return {
      kind: "reference",
      name,
      description,
      type: c.type.name,
      package: c.type.package ?? "",
      link: rootLinkLookup[c.type.name],
    };
  }

  return {
    kind: "object",
    name,
    description,
    properties: c.children?.map(getProperties) ?? [],
  } as any;
}

function handleSignatureType(rt: SomeType | undefined): FunctionReturn {
  if (!rt) return { type: "" };

  if (rt.type === "intrinsic") return { type: rt.name };
  if (rt.type === "array") {
    const obj = handleSignatureType(rt.elementType);
    return { type: `${obj.type}[]`, link: obj.link };
  }
  if (rt.type === "literal") return { type: `${typeof rt.value === "string" ? `"${rt.value}"` : rt.value}` };
  if (rt.type === "reference") return { type: rt.name, link: rootLinkLookup[rt.name] };
  if (rt.type === "reflection") {
    return { type: getProperties(rt.declaration) as FunctionDeclaration };
  }
  if (rt.type === "union")
    return {
      type: rt.types.map(handleSignatureType),
    };

  return { type: "" };
}

const properties = (rootTypes ?? []).map(getProperties as any) as Property[];

const byGroup = Object.groupBy(properties, (p) => {
  return rootGroupLookup.get(p.name) ?? "Misc";
}) as Record<string, Property[]>;

const groupToFolder: Record<string, string> = {
  "Grid API": "(foundational)",
  "Grid State": "(foundational)",
  Events: "(foundational)",
  "Grid View": "(foundational)",
  "Grid Atom": "(foundational)",
  "Cell Edit": "(cell)",
  "Cell Rendering": "(cell)",
  "Cell Selection": "(cell)",
  "Column Groups": "(columns)",
  "Column Header": "(columns)",
  "Column Pivots": "(columns)",
  Column: "(columns)",
  Field: "(columns)",
  Filters: "(functionality)",
  Sort: "(functionality)",
  Export: "(functionality)",
  Frames: "(functionality)",
  Navigation: "(functionality)",
  Row: "(row)",
  "Row Selection": "(row)",
  "Row Grouping": "(row)",
  "Row Drag": "(row)",
  "Row Data Source": "(row)",
  "Row And Column Spanning": "(functionality)",
};

const group = Object.entries(byGroup).map(([group, prop]) => {
  const folder = groupToFolder[group] ?? "(misc)";

  return {
    file: `${folder}/${group.toLowerCase().replaceAll(" ", "-")}.mdx`,
    groupName: group,
    content: prop
      .sort((l, r) => l.name.localeCompare(r.name))
      .map((l) => {
        if (l.name === "AggFn") {
          const type = `export interface ${l.name}<T> {
          /** 
           * ${l.description.replaceAll("`", "'").split("\n").join("\n * ")}
           */
          AggFn: <T>(data: (T | null)[], grid: Grid<T>) => unknown
          }`;

          return `## \`${l.name}\`<span className="type-tag" style={{ '--type-content': "'${l.kind}'" }} />\n\n<AutoTypeTable type={\`${type}\`} />\n`;
        }

        if (l.name === "SortComparatorFn") {
          const type = `export interface ${l.name}<T> {
          /** 
           * ${l.description.replaceAll("`", "'").split("\n").join("\n * ")}
           */
          SortComparatorFn<T>: <T>(l: FieldDataParam<T>, r: FieldDataParam<T>, opts: any) => number
          }`;

          return `## \`${l.name}\`<span className="type-tag" style={{ '--type-content': "'${l.kind}'" }} />\n\n<AutoTypeTable type={\`${type}\`} />\n`;
        }
        if (l.name === "SortComparators") {
          const type = `export interface ${l.name}<T> {
          /** 
           * ${l.description.replaceAll("`", "'").split("\n").join("\n * ")}
           */
          SortComparators: string
          }`;

          return `## \`${l.name}\`<span className="type-tag" style={{ '--type-content': "'${l.kind}'" }} />\n\n<AutoTypeTable type={\`${type}\`} />\n`;
        }

        if (l.kind === "function") {
          const returnType = renderTypeExpr(l.return.type);
          const params = renderTypeExpr(l.params);

          const type = `export interface ${l.name} {

          /** 
           * ${l.description.replaceAll("`", "'").split("\n").join("\n * ")}
           */
          ${l.name}: (${l.params.map((c) => {
            return `${c.name}: (${params}) => ${returnType}`;
          })})
          }`;

          return `## \`${l.name}\`<span className="type-tag" style={{ '--type-content': "'${l.kind}'" }} />\n\n<AutoTypeTable type={\`${type}\`} />\n`;
        }

        if (l.kind === "union") {
          const params = l.properties.map((c) => renderTypeExpr(c.type)).join(" | ");

          const type = {
            [l.name]: {
              description: l.description.replaceAll("`", "\\`"),
              type: l.name === "FocusCellParams" ? "PositionParams" : params,
            },
          };

          return `## \`${l.name}\`<span className="type-tag" style={{ '--type-content': "'${l.kind}'" }} />\n\n<TypeTable type={${JSON.stringify(type)}} />\n`;
        }

        return `## \`${l.name}\`<span className="type-tag" style={{ '--type-content': "'${l.kind}'" }} />\n\n${l.description}\n\n<AutoTypeTable path="../packages/commercial-lytenyte-pro/src/+types.ts" name="${l.name}" />\n\n`;
      })
      .join("\n"),
  };
});

const typeLinks = Object.entries(byGroup)
  .map(([group, prop]) => {
    const base = `docs/reference/${group.toLowerCase().replaceAll(" ", "-")}`;

    return Object.fromEntries(
      prop.map((c) => [c.name, `${base}#${c.name.toLocaleLowerCase()}`.toLowerCase()]),
    );
  })
  .reduce((acc, o) => ({ ...acc, ...o }), {});

fs.ensureFileSync(`../../documentation/components/auto-type-table/type-links.ts`);
writeFileSync(
  `../../documentation/components/auto-type-table/type-links.ts`,
  `export const typeLinks: Record<string, string> = ${JSON.stringify(typeLinks)}`,
);

const folders = new Set(Object.values(groupToFolder));

folders.forEach((c) => {
  if (fs.pathExistsSync(`../../documentation/content/docs/reference/${c}`))
    rmdirSync(`../../documentation/content/docs/reference/${c}`, { recursive: true });
});

group.forEach((f) => {
  const frontMatter = `---\ntitle: ${f.groupName}\ndescription: The API reference for the ${f.groupName.toLowerCase()} functionality in LyteNyte Grid.\n---`;

  fs.ensureFileSync(`../../documentation/content/docs/reference/${f.file}`);
  writeFileSync(`../../documentation/content/docs/reference/${f.file}`, frontMatter + "\n" + f.content);
});

const folderMeta = {
  "(foundational)": JSON.stringify({
    title: "Foundational",
    pages: ["grid-state", "grid-api", "grid-view", "grid-atom", "events", "..."],
    defaultOpen: true,
  }),
  "(cell)": JSON.stringify({
    title: "Cells",
    pages: ["cell-rendering", "cell-edit", "cell-selection", "..."],
    defaultOpen: true,
  }),
  "(columns)": JSON.stringify({
    title: "Columns",
    pages: ["column", "column-groups", "column-header", "column-pivots", "field", "..."],
    defaultOpen: true,
  }),
  "(functionality)": JSON.stringify({
    title: "Functionality",
    page: ["filters", "sort", "navigation", "row-and-column-spanning", "frames", "export", "..."],
    defaultOpen: true,
  }),
  "(row)": JSON.stringify({
    title: "Rows",
    pages: ["row", "row-data-source", "row-selection", "row-grouping", "row-drag", "..."],
    defaultOpen: true,
  }),
};

Object.entries(folderMeta).map(([folder, content]) => {
  fs.ensureFileSync(`../../documentation/content/docs/reference/${folder}/meta.json`);
  writeFileSync(`../../documentation/content/docs/reference/${folder}/meta.json`, content);
});
