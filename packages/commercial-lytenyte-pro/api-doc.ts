import { readFile } from "fs/promises";
import type {
  CommentDisplayPart,
  DeclarationReflection,
  ReferenceReflection,
  SomeType,
} from "typedoc";
import { type JSONOutput } from "typedoc";
import { generateMDX } from "./mdx-generator";
import { writeFileSync } from "fs";

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

    return [c.name, `${rootPath}/${groupName.toLowerCase().replaceAll(" ", "-")}#${c.name}`];
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
  if (rt.type === "literal")
    return { type: `${typeof rt.value === "string" ? `"${rt.value}"` : rt.value}` };
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

const entries = Object.entries(byGroup).map(([name, properties]) => {
  const sortedProps = properties.sort((l, r) => l.name.localeCompare(r.name));

  return {
    groupName: name,
    fileName: `${name.toLowerCase().replaceAll(" ", "-")}.mdx`,
    contents: sortedProps.map((c) => generateMDX(c)).join("\n\n"),
  };
});

entries.forEach((f) => {
  const frontMatter = `---\ntitle: ${f.groupName} | 1771 Technologies\ndescription: The API reference for the ${f.groupName.toLowerCase()} functionality in LyteNyte Grid.\n---`;

  writeFileSync(`./generated-docs/${f.fileName}`, frontMatter + "\n" + f.contents);
});
