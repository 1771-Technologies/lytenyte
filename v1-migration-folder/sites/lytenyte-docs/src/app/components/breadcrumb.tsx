"use client";
import { usePathname } from "next/navigation";
import { useBreadcrumb } from "fumadocs-core/breadcrumb";
import type { PageTree } from "fumadocs-core/server";
import { Fragment } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@radix-ui/react-icons";

export function Breadcrumb({ tree }: { tree: PageTree.Root }) {
  const pathname = usePathname();
  const items = useBreadcrumb(pathname, tree).filter((c) => c.url);

  if (items.length === 0) return null;

  return (
    <div className="font-inter mb-1 flex flex-row items-center gap-1 text-sm tracking-wide text-gray-800">
      {items.map((item, i) => (
        <Fragment key={i}>
          {i !== 0 && <ChevronRightIcon className="size-4 shrink-0 rtl:rotate-180" />}
          {item.url ? (
            <Link href={item.url} className="hover:text-brand-700 truncate">
              {item.name}
            </Link>
          ) : (
            <span className="truncate">{item.name}</span>
          )}
        </Fragment>
      ))}
    </div>
  );
}
