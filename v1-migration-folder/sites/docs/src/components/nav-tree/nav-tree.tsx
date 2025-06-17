"use client";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import type { DocNode, SectionNode } from "../../lib/routing/get-doc-tree";
import { IconButton } from "../ui/icon-button";
import { tw } from "../utils";
import { Fragment, useState } from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { NavTreeLink } from "./nav-link";
import { useRouter } from "waku";
import { useQueryParamState } from "./use-query-toggle";

export function NavTree(props: { sections: SectionNode[]; linkPrefix: string; path: string }) {
  return (
    <div className="flex w-full select-none flex-col gap-2 p-3 text-sm leading-5 tracking-tight">
      {props.sections.map((c) => {
        if (!c.name) {
          return (
            <Fragment key={c.name}>
              {c.children.map((v, i) => (
                <RenderSection node={v} key={i} linkPrefix={props.linkPrefix} path={props.path} />
              ))}
              <Separator orientation="horizontal" className="bg-gray-200" />
            </Fragment>
          );
        }
        return (
          <Fragment key={c.name}>
            <RenderSection node={c} linkPrefix={props.linkPrefix} path={props.path} />
            <Separator orientation="horizontal" className="bg-gray-200" />
          </Fragment>
        );
      })}
    </div>
  );
}

function RenderSection({
  node,
  linkPrefix,
  path,
}: {
  node: SectionNode | DocNode;
  linkPrefix: string;
  path: string;
}) {
  let link = node.doc ? `${linkPrefix}/${node.doc?.slug.join("/")}` : null;
  if (link && link.endsWith("/")) link = link.slice(0, link.length - 2);

  const defaultValue = node.type === "section" ? node.expanded : false;
  const localKey = node.type === "section" ? `${linkPrefix}-${node.id}` : "__nav__:leaf";
  const [value, setValue] = useQueryParamState(localKey, defaultValue ? "yes" : "no");

  const expanded = value === "yes";
  const toggle = () => setValue((prev) => (prev === "yes" ? "no" : "yes"));

  if (node.type === "doc") {
    return (
      <NavTreeLink isLeaf to={link!} path={path}>
        {node.doc.navKey ?? node.doc.title}
      </NavTreeLink>
    );
  }

  return (
    <div className={tw("pl-3")}>
      <div className="m -ml-5 flex items-center gap-1">
        {link != null && (
          <>
            <IconButton className="size-6" onClick={toggle}>
              {!expanded && <ChevronRightIcon className="size-4" />}
              {expanded && <ChevronDownIcon className="size-4" />}
              <span className="sr-only">Expanded section {node.name}</span>
            </IconButton>
            <NavTreeLink to={link} className="hover:text-primary-600" path={path}>
              {node.name}
            </NavTreeLink>
          </>
        )}
        {link == null && (
          <>
            <IconButton className="size-6" onClick={toggle}>
              {!expanded && <ChevronRightIcon className="size-4" />}
              {expanded && <ChevronDownIcon className="size-4" />}
            </IconButton>

            <Button onClick={toggle} className="hover:text-primary-600">
              <span>{node.name}</span>
            </Button>
          </>
        )}
      </div>

      <div
        className={tw(
          "grid overflow-hidden transition-[grid-template-rows]",
          !expanded && "grid-rows-[0fr]",
          expanded && "grid-rows-[1fr]",
        )}
      >
        <nav className="min-h-0">
          <ul className="ml-3 mt-2 flex flex-col gap-2 border-l border-gray-200 pl-3">
            {node.children.map((c, i) => {
              return (
                <li key={i}>
                  <RenderSection node={c} linkPrefix={linkPrefix} path={path} />
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
