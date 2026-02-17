import { Logo1771 } from "@/components/company/logo-1771";
import { LogoLyteNyte } from "@/components/company/logo-lytenyte";
import { ApiReferenceIcon } from "@/components/icons/api-reference-icon";
import { ChangelogIcon } from "@/components/icons/changelog-icon";
import { GuidesIcon } from "@/components/icons/guides-icon";
import { DocsLayout } from "@/components/layout/docs/docs-layout";
import { source } from "@/lib/source";
import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        mode: "top",
        title: <LogoLyteNyte />,
        url: "/docs/v1/intro-getting-started",
      }}
      githubUrl="https://github.com/1771-Technologies/lytenyte"
      themeSwitch={{ mode: "light-dark" }}
      links={[
        {
          text: "1771 Technologies home page",
          external: false,
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
            url: "/docs/v1/intro-getting-started",
            matchSelected: {
              match: ["/docs"],
              ignore: ["/docs/v1/reference", "/docs/v1/changelog"],
            },
            description:
              "Tutorials and quick walkthroughs of LyteNyte Grid. These docs are more user friendly and description than the API reference.",
            icon: <GuidesIcon className="size-4" />,
          },
          {
            title: "API Reference",
            url: "/docs/v1/reference",
            matchSelected: {
              match: ["/docs/v1/reference"],
              ignore: [],
            },
            description:
              "In depth references to all the different parts of the LyteNyte Grid components, apis, and interfaces.",
            icon: <ApiReferenceIcon className="size-4" />,
          },
          {
            title: "Changelog",
            url: "/docs/v1/changelog/latest",
            matchSelected: {
              match: ["/docs/v1/changelog"],
              ignore: [],
            },
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
