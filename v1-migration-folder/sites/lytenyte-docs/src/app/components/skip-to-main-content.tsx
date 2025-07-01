"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SkipToMainContent() {
  const path = usePathname();
  return (
    <Link
      className="focus:outline-brand-500/40 pointer-events-none fixed top-3 flex w-fit rounded bg-gray-200 px-2 py-1 opacity-0 focus:pointer-events-auto focus:opacity-100 focus:outline-1 focus:outline-solid"
      href={`${path}#main-content` as any}
    >
      Skip to content?
    </Link>
  );
}
