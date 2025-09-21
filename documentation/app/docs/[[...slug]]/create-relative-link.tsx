import type { LoaderConfig, LoaderOutput, Page } from "fumadocs-core/source";
import type { ComponentProps, FC } from "react";
import * as path from "node:path";
import defaultMdxComponents from "fumadocs-ui/mdx";

/**
 * Extend the default Link component to resolve relative file paths in `href`.
 *
 * @param page the current page
 * @param source the source object
 * @param OverrideLink The component to override from
 */
export function createRelativeLink(
  source: LoaderOutput<LoaderConfig>,
  page: Page,
  OverrideLink: FC<ComponentProps<"a">> = defaultMdxComponents.a,
): FC<ComponentProps<"a">> {
  return async function RelativeLink({ href, ...props }) {
    // resolve relative href
    if (href && href.startsWith(".")) {
      // The first part of the split is the contents dir and the last part is the file name.
      const folder = page.absolutePath.split("/").slice(1, -1).join("/");
      const finalPath = path.join(folder, href);

      const ref = stripBracketedSegments(finalPath);

      const pageLinkedTo = source.getPages().find((c) => {
        return c.url === "/" + ref;
      });

      if (!pageLinkedTo)
        throw new Error(`Invalid relative path provided!: ${href}. In file ${page.absolutePath}`);

      const target = source.getPageByHref(pageLinkedTo.url, {
        language: page.locale,
      });

      if (target) {
        href = target.hash ? `${target.page.url}#${target.hash}` : target.page.url;
      }
    }

    return <OverrideLink href={href} {...props} />;
  };
}

function stripBracketedSegments(path: string): string {
  return path
    .split("/")
    .filter((segment) => !/^\(.*\)$/.test(segment)) // remove bracketed segments
    .join("/");
}
