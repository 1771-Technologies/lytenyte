"use client";
import { useRouter } from "waku";

export function SkipToMainContent() {
  const { path } = useRouter();
  return (
    <a
      className="focus:outline-brand-500/40 focus:outline-solid pointer-events-none fixed top-3 flex w-fit rounded bg-gray-200 px-2 py-1 opacity-0 focus:pointer-events-auto focus:opacity-100 focus:outline-1"
      href={`${path}#main-content` as any}
    >
      Skip to content?
    </a>
  );
}
