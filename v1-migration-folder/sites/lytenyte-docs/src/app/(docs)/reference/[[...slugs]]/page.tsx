import { referenceCollection } from "@/source";
import { DocShell } from "@/app/components/doc-shell";
import { computePageMetadata } from "@/app/components/lib/compute-page-metadata";

export default async function Page({
  params,
}: {
  params: Promise<{ slugs: string[] | undefined }>;
}) {
  const slugs = (await params).slugs ?? [];
  const source = referenceCollection;

  return <DocShell slugs={slugs} source={source} />;
}

export async function generateStaticParams() {
  return referenceCollection.generateParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  return await computePageMetadata(params, referenceCollection);
}
