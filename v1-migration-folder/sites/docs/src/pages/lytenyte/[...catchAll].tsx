import type { PageProps } from "waku/router";
import { MDXContent } from "@content-collections/mdx/react";
import { allLytenyteApiRefs, allLytenyteChangelogs, allLytenyteGuides } from "content-collections";
import { getStaticCollectionPaths } from "../../lib/routing/get-static-collection-paths";
import { makeCollectionLookup } from "../../lib/routing/make-collection-lookup";
import { getDocForCatchAllSlug } from "../../lib/routing/get-doc-for-catch-all-slug";
import { Diagonals } from "../../components/ui/diagonals/diagonals";
import { Header } from "../../components/header";
import { SecondaryHeader } from "../../components/secondary-header/secondary-header";
import { getDocTree } from "../../lib/routing/get-doc-tree";
import { NavTree } from "../../components/nav-tree/nav-tree";

const lookup = makeCollectionLookup([
  { docs: allLytenyteGuides },
  { docs: allLytenyteChangelogs, prefix: "changelog" },
  { docs: allLytenyteApiRefs, prefix: "reference" },
]);

export default async function DocsPage(props: PageProps<"/docs/[...catchAll]">) {
  const doc = getDocForCatchAllSlug(props.catchAll, lookup);

  const isReference = props.catchAll[0] === "reference";
  const isChangelog = props.catchAll[0] === "changelog";

  const guides = isChangelog
    ? allLytenyteChangelogs
    : isReference
      ? allLytenyteApiRefs
      : allLytenyteGuides;

  const tree = getDocTree(guides);

  if (!doc) return null;

  const prefix = isReference
    ? "/lytenyte/reference"
    : isChangelog
      ? "/lytenyte/changelog"
      : "/lytenyte";

  let path = `/lytenyte/${props.catchAll.join("/")}`;
  if (path.endsWith("/")) path = path.slice(0, path.length - 2);

  return (
    <>
      <div className="h-header w-full-client fixed top-0 z-50 flex flex-col border-b border-gray-200 bg-gray-50 px-6">
        <Header />
        <SecondaryHeader />
      </div>
      <div className="pt-header flex flex-1">
        {/* Side nav */}
        <div className="min-w-side-nav top-header h-full-header w-side-nav fixed hidden overflow-auto border-r border-gray-200 xl:flex">
          <NavTree sections={tree} linkPrefix={prefix} path={path} />
        </div>

        <div className="xl:pl-side-nav flex w-full">
          <Diagonals className="hidden h-full w-12 border-r border-gray-200 xl:block" />

          <div className="flex flex-1 justify-center pt-12">
            <div className="3xl:max-w-[800px] flex w-full max-w-[780px] flex-col px-4">
              {/* Main content */}
              <main className="flex-1" id="main-content">
                <MDXContent code={doc.mdx} />
                <button className="focus:bg-danger-300">Click me</button>
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
    </>
  );
}

export const getConfig = async () => {
  const guidePaths = getStaticCollectionPaths(allLytenyteGuides);
  const referencePaths = getStaticCollectionPaths(allLytenyteApiRefs, "reference");
  const changelogPaths = getStaticCollectionPaths(allLytenyteChangelogs, "changelog");

  return {
    render: "static",
    staticPaths: [...guidePaths, ...referencePaths, ...changelogPaths] as string[][],
  } as const;
};
