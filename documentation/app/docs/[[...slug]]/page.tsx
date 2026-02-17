import { source } from "@/lib/source";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import { LLMCopyButton, ViewOptions } from "@/components/page-actions";

const owner = "1771-Technologies";
const repo = "lytenyte";

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDXContent = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle className="relative flex w-full items-center">
        {page.data.title}

        <div className="xs:top-[unset] absolute right-0 top-[-42px] flex flex-row items-center">
          <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
          <ViewOptions
            markdownUrl={`${page.url}.mdx`}
            githubUrl={`https://github.com/${owner}/${repo}/blob/main/documentation/content/docs/${page.path}`}
          />
        </div>
      </DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDXContent components={getMDXComponents({})} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: `${page.data.title} | 1771 Technologies`,
    description: page.data.description,
  };
}
