import { DocsLayout } from "@/docs-layout/layout/docs/docs-layout";
import { source } from "@/lib/source";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        mode: "top",
        title: "x",
        url: "docs/",
      }}
    >
      {children}
    </DocsLayout>
  );
}
