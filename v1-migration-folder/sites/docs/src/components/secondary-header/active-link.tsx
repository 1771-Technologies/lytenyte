"use client";
import type { ComponentProps } from "react";
import { Link, useRouter } from "waku";
import { tw } from "../utils";

export function ActiveLink({
  to,
  children,
  match,
  exclude,
  ...props
}: ComponentProps<typeof Link> & { match: string; exclude: string[] }) {
  const { path } = useRouter();

  const Component = to.startsWith("http") ? "a" : Link;
  const hrefProp = to.startsWith("http") ? { href: to } : { to };

  const matches = path.startsWith(match) && !exclude.some((c) => path.startsWith(c));

  return (
    <Component
      {...(hrefProp as any)}
      {...props}
      className={tw(
        "hover:text-primary-500 relative flex h-full items-center px-3 py-1 transition-colors",
        "after:absolute after:bottom-0 after:left-0 after:block after:h-0.5 after:w-full after:bg-transparent after:transition-colors after:content-['']",
        "focus-visible:bg-brand-200/40",
        matches && "after:bg-primary-500",
        props.className,
      )}
    >
      {children}
    </Component>
  );
}
