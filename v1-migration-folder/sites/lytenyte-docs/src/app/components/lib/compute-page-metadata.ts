import { LoaderOutput } from "fumadocs-core/source";
import { notFound } from "next/navigation";

export async function computePageMetadata(
  params: Promise<{ slug?: string[] }>,
  source: LoaderOutput<any>,
) {
  const slugs = (await params).slug ?? [];

  const page = source.getPage(slugs);
  if (!page) notFound();

  return {
    title: `${page.data.title} | 1771 Technologies`,
    description: (page.data as any).description,
  };
}
