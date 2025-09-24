import "./auto-type-table.css";
import type { AutoTypeTableProps } from "fumadocs-typescript/ui";
import { AutoTypeTable as ATT, renderMarkdownDefault } from "./ui/fuma-auto-type-table";
import { createGenerator } from "fumadocs-typescript";
import type { AnnotationHandler } from "codehike/code";
import { highlight, Pre } from "codehike/code";
import { typeLinks } from "./type-links";
import Link from "fumadocs-core/link";
import { cn } from "../cn";
import type { TypeNode } from "./ui/type-table-component";
import { TypeTable } from "./ui/type-table-component";

const generator = createGenerator({ cache: false });

export async function AutoTypeTable(props: AutoTypeTableProps) {
  return (
    <div className="att">
      <ATT
        {...props}
        generator={generator}
        options={{
          transform: (entry) => {
            entry.simplifiedType = entry.type;
          },
        }}
        renderType={async (t) => {
          if (t.includes("<K extends keyof GridEvents")) t = "GridEvents<T>";
          if (t.startsWith("(columnOrId")) t = t.replace("(columnOrId", "(c");
          t = t.replaceAll("| undefined", "");
          t = t
            .replaceAll("<ArrayBufferLike>", "")
            .replaceAll(" )", ")")
            .replaceAll(";", "")
            .replaceAll("{ ", "{")
            .replaceAll(" }", "}");
          t = t.trim();

          const highlighted = await highlight(
            { lang: "tsx", meta: "", value: linkPatterns + "\n" + t },
            "github-from-css",
          );

          return (
            <Pre
              code={highlighted}
              handlers={[link]}
              className={cn(
                "bg-primary-300/10 border-accent-500/60 w-fit text-nowrap rounded border px-2 py-1 text-[10px] 2xl:text-xs",
                "[&>div>div]:relative [&>div>div]:top-px",
              )}
            />
          );
        }}
      />
    </div>
  );
}

const renderType = async (t: string) => {
  if (t.includes("<K extends keyof GridEvents")) t = "GridEvents<T>";
  if (t.startsWith("(columnOrId")) t = t.replace("(columnOrId", "(c");
  t = t.replaceAll("| undefined", "");
  t = t
    .replaceAll("<ArrayBufferLike>", "")
    .replaceAll(" )", ")")
    .replaceAll(";", "")
    .replaceAll("{ ", "{")
    .replaceAll(" }", "}");
  t = t.trim();

  const highlighted = await highlight(
    { lang: "tsx", meta: "", value: linkPatterns + "\n" + t },
    "github-from-css",
  );

  return (
    <Pre
      code={highlighted}
      handlers={[link]}
      className={cn(
        "bg-primary-300/10 border-accent-500/60 w-fit text-nowrap rounded border px-2 py-1 text-[10px] 2xl:text-xs",
        "[&>div>div]:relative [&>div>div]:top-px",
      )}
    />
  );
};

export async function TT(props: { type: Record<string, TypeNode> }) {
  const entries = Object.fromEntries(
    await Promise.all(
      Object.entries(props.type).map(async ([key, entry]) => {
        return [
          key,
          {
            type: await renderType(entry.type as string),
            description: await renderMarkdownDefault(entry.description as string),
          } as TypeNode,
        ];
      }),
    ),
  );

  return (
    <div className="att">
      <TypeTable type={entries} />
    </div>
  );
}

const hrefToType = Object.fromEntries(Object.keys(typeLinks).map((c) => [typeLinks[c], c]));

const linkPatterns = Object.keys(typeLinks)
  .sort((l, r) => r.length - l.length)
  .map((c) => {
    return `// !link[/${c}/gm] ${typeLinks[c]}`;
  })
  .join("\n");

const link: AnnotationHandler = {
  name: "link",
  Inline: ({ annotation }) => {
    return (
      <Link
        className="text-accent-600 hover:text-accent-800 font-bold transition-colors"
        href={"/" + annotation.query}
      >
        {hrefToType[annotation.query]}
      </Link>
    );
  },
};
