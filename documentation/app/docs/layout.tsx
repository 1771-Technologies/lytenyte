import { Logo1771 } from "@/components/company/logo-1771";
import { LogoLyteNyte } from "@/components/company/logo-lytenyte";
import { ApiReferenceIcon } from "@/components/icons/api-reference-icon";
import { ChangelogIcon } from "@/components/icons/changelog-icon";
import { GuidesIcon } from "@/components/icons/guides-icon";
import { DocsLayout } from "@/components/layout/docs/docs-layout";
import { source } from "@/lib/source";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        mode: "top",
        title: <LogoLyteNyte />,
        url: "docs/",
      }}
      githubUrl="https://github.com/1771-Technologies/lytenyte"
      themeSwitch={{ mode: "light-dark" }}
      links={[
        {
          text: "1771 Technologies home page",
          url: "https://www.1771technologies.com/",
          type: "icon",
          icon: <Logo1771 />,
        },
      ]}
      tabMode="navbar"
      sidebar={{
        tabs: [
          {
            title: "Guides",
            url: "/docs",
            description:
              "Tutorials and quick walkthroughs of LyteNyte Grid. These docs are more user friendly and description than the API reference.",
            icon: <GuidesIcon className="size-4" />,
          },
          {
            title: "API Reference",
            url: "/docs/reference",
            description:
              "In depth references to all the different parts of the LyteNyte Grid components, apis, and interfaces.",
            icon: <ApiReferenceIcon className="size-4" />,
          },
          {
            title: "Changelog",
            url: "/docs/changelog",
            description: "A log of all the changes introduced between LyteNyte Grid versions.",
            icon: <ChangelogIcon className="size-4" />,
          },
        ],
      }}
    >
      {children}
    </DocsLayout>
  );
}
