import { LoaderOutput } from "fumadocs-core/source";
import { DocItem, getDocTree } from "./lib/routing/get-doc-tree";
import { notFound } from "next/navigation";
import { NavTree } from "./nav-tree/nav-tree";
import { Diagonals } from "./ui/diagonals/diagonals";
import { Breadcrumb } from "./breadcrumb";
import { Anchor } from "./mdx/anchor";
import { Code } from "./mdx/code/code";
import { CodeWithTooltips } from "./mdx/code/code-with-tooltips";

export interface DocShellProps {
  readonly slugs: string[];
  readonly source: LoaderOutput<any>;
}

export async function DocShell({ slugs, source }: DocShellProps) {
  const page = source.getPage(slugs);
  const pages = source.getPages();

  const docs = pages.map<DocItem>((page) => {
    const splitPath = page.path.split("/");
    splitPath.pop()!;

    if (!splitPath.length) {
      console.error(
        "Every content collection item should be nested within a folder. Use (00n) for folders that should not impact routing",
      );
    }

    const sections = splitPath
      .filter((c) => c.startsWith("("))
      .map((p) => {
        const cleaned = p.replace("(", "").split(").")[0].replace(")", "");

        const [priorityRaw, ...nameParts] = cleaned.split("-");
        const name = nameParts.join("-");

        const priority = Number.parseInt(priorityRaw);
        if (Number.isNaN(priority))
          return { priority: 999, name, expanded: priorityRaw.includes("+") };
        return { priority, name, expanded: priorityRaw.includes("+") };
      });
    const priority = page.data.priority;

    return {
      sections,
      priority,
      slug: page.slugs,
      title: page.data.title,
      navKey: page.data.navKey,
      navTitle: page.data.navTitle,
      url: page.url,
    };
  });

  const tree = getDocTree(docs);
  if (!page) notFound();

  const MDX = page.data.body;

  let path = `/${slugs.join("/")}`;
  if (path.endsWith("/")) path = path.slice(0, path.length - 2);

  return (
    <div className="pt-header flex flex-1">
      {/* Side nav */}
      <div className="min-w-side-nav top-header h-full-header w-side-nav fixed hidden overflow-auto border-r border-gray-200 xl:flex">
        <NavTree sections={tree} path={path} />
      </div>

      <div className="xl:pl-side-nav flex w-full">
        <Diagonals className="hidden h-full w-12 border-r border-gray-200 xl:block" />

        <div className="flex flex-1 justify-center bg-gray-50 pt-12">
          <div className="3xl:max-w-[800px] flex w-full max-w-[780px] flex-col px-4">
            {/* Main content */}
            <main className="doc flex-1" id="main-content">
              <Breadcrumb tree={source.pageTree as any} />
              <MDX
                components={{
                  a: Anchor,
                  Code,
                  CodeWithTooltips,
                }}
              />
            </main>
            <footer>Footer here</footer>
          </div>
          <div className="3xl:w-[250px] 3xl:pl-12 sticky top-[calc(48px+var(--spacing-header))] hidden h-[calc(100vh-48px-var(--spacing-header))] 2xl:block 2xl:w-[200px] 2xl:pl-2">
            On this page
          </div>
        </div>

        <Diagonals alternate className="hidden h-full w-12 border-l border-gray-200 xl:block" />
      </div>
    </div>
  );
}
