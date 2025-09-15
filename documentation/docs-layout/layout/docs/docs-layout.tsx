import { type ComponentProps, type HTMLAttributes, type ReactNode, useMemo } from "react";
import { type BaseLayoutProps, BaseLinkItem, getLinks } from "../shared/index";
import { TreeContextProvider } from "fumadocs-ui/contexts/tree";
import { cn } from "../../cn";
import { buttonVariants } from "../../ui/button";
import { Languages, X } from "lucide-react";
import { LanguageToggle } from "../../language-toggle";
import { ThemeToggle } from "../../theme-toggle";
import type { PageTree } from "fumadocs-core/server";
import { LayoutBody } from "./layout-body";
import { NavProvider } from "fumadocs-ui/contexts/layout";
import { type Option } from "../../root-toggle";
import { HideIfEmpty } from "fumadocs-core/hide-if-empty";
import { getSidebarTabs, type GetSidebarTabsOptions } from "fumadocs-ui/utils/get-sidebar-tabs";
import { Sidebar, SidebarProps } from "./sidebar/sidebar";
import { SidebarComponents, SidebarPageTree } from "./sidebar/sidebar-page-tree";
import { SidebarContent } from "./sidebar/sidebar-content";
import { SidebarViewport } from "./sidebar/sidebar-viewport";
import { SidebarLinkItem } from "./sidebar/sidebar-link-item";
import { SidebarHeader } from "./sidebar/sidebar-header";
import { SidebarFooter } from "./sidebar/sidebar-footer";
import { SidebarContentMobile } from "./sidebar/sidebar-content-mobile";
import { SidebarTrigger } from "./sidebar/sidebar-trigger";
import { Navbar } from "./navbar/navbar";
import { NavbarSidebarTrigger } from "./navbar/navbar-sidebar-trigger";
import { DocsNavbar } from "./navbar/docs-navbar";
import { LayoutTabs } from "./layout-tabs/layout-tabs";

export interface DocsLayoutProps extends BaseLayoutProps {
  tree: PageTree.Root;
  tabMode?: "sidebar" | "navbar";

  nav?: BaseLayoutProps["nav"] & {
    mode?: "top" | "auto";
  };

  sidebar?: SidebarOptions;

  containerProps?: HTMLAttributes<HTMLDivElement>;
}

interface SidebarOptions
  extends ComponentProps<"aside">,
    Pick<SidebarProps, "defaultOpenLevel" | "prefetch"> {
  components?: Partial<SidebarComponents>;

  tabs?: Option[] | GetSidebarTabsOptions | false;
  footer?: ReactNode;
}

export function DocsLayout(props: DocsLayoutProps) {
  const {
    tabMode = "sidebar",
    nav: { transparentMode, ...nav } = {},
    sidebar: { tabs: tabOptions, ...sidebarProps } = {},
    i18n = false,
    themeSwitch = { enabled: true },
  } = props;

  const navMode = nav.mode ?? "auto";
  const links = getLinks(props.links ?? [], props.githubUrl);
  const tabs = useMemo(() => {
    if (Array.isArray(tabOptions)) {
      return tabOptions;
    }

    if (typeof tabOptions === "object") {
      return getSidebarTabs(props.tree, tabOptions);
    }

    if (tabOptions !== false) {
      return getSidebarTabs(props.tree);
    }

    return [];
  }, [tabOptions, props.tree]);

  function sidebar() {
    const { footer, components, prefetch, defaultOpenLevel, ...rest } = sidebarProps;
    const iconLinks = links.filter((item) => item.type === "icon");

    const rootToggle = (
      <>
        {tabMode === "sidebar" && tabs.length > 0 && <LayoutTabs options={tabs} vertical />}
        {tabMode === "navbar" && tabs.length > 0 && (
          <LayoutTabs options={tabs} className="lg:hidden" vertical />
        )}
      </>
    );

    const viewport = (
      <SidebarViewport>
        {links
          .filter((item) => item.type !== "icon")
          .map((item, i, arr) => (
            <SidebarLinkItem
              key={i}
              item={item}
              className={cn("lg:hidden", i === arr.length - 1 && "mb-4")}
            />
          ))}

        <SidebarPageTree components={components} />
      </SidebarViewport>
    );

    const content = (
      <SidebarContent
        {...rest}
        className={cn(
          "pt-4",
          navMode === "top" ? "border-e-0 bg-transparent" : "[--fd-nav-height:0px]",
          rest.className
        )}
      >
        {viewport}
        <HideIfEmpty
          as={SidebarFooter}
          className="flex flex-row text-fd-muted-foreground items-center border-transparent"
        >
          {iconLinks.map((item, i) => (
            <BaseLinkItem
              key={i}
              item={item}
              className={cn(
                buttonVariants({
                  size: "icon-sm",
                  color: "ghost",
                  className: "lg:hidden",
                })
              )}
              aria-label={item.label}
            >
              {item.icon}
            </BaseLinkItem>
          ))}
          {footer}
        </HideIfEmpty>
      </SidebarContent>
    );

    const mobile = (
      <SidebarContentMobile {...rest}>
        <SidebarHeader>
          <div className="flex justify-between items-center pb-2">
            {nav.title}
            <SidebarTrigger
              className={cn(
                buttonVariants({
                  size: "icon-sm",
                  color: "ghost",
                  className: "ms-auto text-fd-muted-foreground",
                })
              )}
            >
              <X />
            </SidebarTrigger>
          </div>
          {rootToggle}
        </SidebarHeader>
        {viewport}
        <HideIfEmpty as={SidebarFooter} className="flex flex-row items-center justify-end">
          {iconLinks.map((item, i) => (
            <BaseLinkItem
              key={i}
              item={item}
              className={cn(
                buttonVariants({
                  size: "icon-sm",
                  color: "ghost",
                }),
                "text-fd-muted-foreground lg:hidden",
                i === iconLinks.length - 1 && "me-auto"
              )}
              aria-label={item.label}
            >
              {item.icon}
            </BaseLinkItem>
          ))}
          {i18n ? (
            <LanguageToggle>
              <Languages className="size-4.5 text-fd-muted-foreground" />
            </LanguageToggle>
          ) : null}
          {themeSwitch.enabled !== false &&
            (themeSwitch.component ?? (
              <ThemeToggle mode={themeSwitch.mode ?? "light-dark-system"} />
            ))}
          {footer}
        </HideIfEmpty>
      </SidebarContentMobile>
    );

    return (
      <Sidebar
        defaultOpenLevel={defaultOpenLevel}
        prefetch={prefetch}
        Content={content}
        Mobile={mobile}
      />
    );
  }

  return (
    <TreeContextProvider tree={props.tree}>
      <NavProvider transparentMode={transparentMode}>
        <LayoutBody
          {...props.containerProps}
          className={cn(
            "lg:[--fd-sidebar-width:286px] xl:[--fd-toc-width:286px]",
            props.containerProps?.className
          )}
        >
          {sidebar()}
          <DocsNavbar {...props} links={links} tabs={tabMode == "navbar" ? tabs : []} />
          {props.children}
        </LayoutBody>
      </NavProvider>
    </TreeContextProvider>
  );
}

export { Navbar, NavbarSidebarTrigger };
