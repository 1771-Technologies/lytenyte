import { Option } from "@/components/root-toggle";
import { BaseLinkItem, LinkItemType } from "../../shared";
import { DocsLayoutProps, Navbar, NavbarSidebarTrigger } from "../docs-layout";
import { cn } from "@/components/cn";
import { Languages } from "lucide-react";
import Link from "fumadocs-core/link";
import { LargeSearchToggle, SearchToggle } from "@/components/search-toggle";
import { NavbarLinkItem } from "./navbar-link-item";
import { buttonVariants } from "@/components/ui/button";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { LayoutTabs } from "../layout-tabs/layout-tabs";

export function DocsNavbar({
  links,
  tabs,
  searchToggle = {},
  themeSwitch = {},
  nav = {},
  ...props
}: DocsLayoutProps & {
  links: LinkItemType[];
  tabs: Option[];
}) {
  const navMode = nav.mode ?? "auto";

  return (
    <Navbar
      mode={navMode}
      className={cn(
        "on-root:[--fd-nav-height:56px] md:on-root:[--fd-nav-height:64px]",
        tabs.length > 0 && "lg:on-root:[--fd-nav-height:104px]",
      )}
    >
      <div className={cn("flex flex-1 gap-2 border-b px-4 md:px-6", navMode === "top" && "ps-7")}>
        <div
          className={cn(
            "items-center",
            navMode === "top" && "flex flex-1",
            navMode === "auto" && ["hidden max-md:flex"],
          )}
        >
          <Link
            href={nav.url ?? "/"}
            className={cn(
              "inline-flex items-center gap-2.5 font-semibold",
              navMode === "auto" && "md:hidden",
            )}
          >
            {nav.title}
          </Link>
        </div>
        {searchToggle.enabled !== false &&
          (searchToggle.components?.lg ? (
            <div
              className={cn(
                "my-auto w-full max-md:hidden",
                navMode === "top" ? "max-w-sm rounded-xl" : "max-w-[240px]",
              )}
            >
              {searchToggle.components.lg}
            </div>
          ) : (
            <LargeSearchToggle
              hideIfDisabled
              className={cn(
                "my-auto w-full max-lg:hidden",
                navMode === "top" ? "max-w-sm rounded-xl ps-2.5" : "max-w-[240px]",
              )}
            />
          ))}
        <div className="flex flex-1 items-center justify-end md:gap-2">
          <div className="flex items-center gap-6 empty:hidden max-lg:hidden">
            {links
              .filter((item) => item.type !== "icon")
              .map((item, i) => (
                <NavbarLinkItem
                  key={i}
                  item={item}
                  className="text-fd-muted-foreground hover:text-fd-accent-foreground data-[active=true]:text-fd-primary text-sm transition-colors"
                />
              ))}
          </div>
          {nav.children}
          {links
            .filter((item) => item.type === "icon")
            .map((item, i) => (
              <BaseLinkItem
                key={i}
                item={item}
                className={cn(
                  buttonVariants({ size: "icon-sm", color: "ghost" }),
                  "text-fd-muted-foreground max-lg:hidden",
                )}
                aria-label={item.label}
              >
                {item.icon}
              </BaseLinkItem>
            ))}

          <div className="flex items-center lg:hidden">
            {searchToggle.enabled !== false &&
              (searchToggle.components?.sm ?? <SearchToggle hideIfDisabled className="p-2" />)}
            <NavbarSidebarTrigger className="-me-1.5 p-2" />
          </div>

          <div className="flex items-center gap-2 max-lg:hidden">
            {props.i18n ? (
              <LanguageToggle>
                <Languages className="size-4.5 text-fd-muted-foreground" />
              </LanguageToggle>
            ) : null}
            {themeSwitch.enabled !== false &&
              (themeSwitch.component ?? (
                <ThemeToggle mode={themeSwitch.mode ?? "light-dark-system"} />
              ))}
          </div>
        </div>
      </div>
      {tabs.length > 0 && (
        <LayoutTabs
          className={cn("h-10 border-b px-6 max-lg:hidden", navMode === "top" && "ps-7")}
          options={tabs}
        />
      )}
    </Navbar>
  );
}
